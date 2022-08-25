document.addEventListener('DOMContentLoaded', function() {

  // Use buttons to toggle between views
  document.querySelector('#inbox').addEventListener('click', () => load_mailbox('inbox'));
  document.querySelector('#sent').addEventListener('click', () => load_mailbox('sent'));
  document.querySelector('#archived').addEventListener('click', () => load_mailbox('archive'));
  document.querySelector('#compose').addEventListener('click', compose_email);

  // By default, load the inbox
  load_mailbox('inbox');

  //when email is sent
  document.querySelector('form').onsubmit=send_email
});

function compose_email() {

  // Show compose view and hide other views
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';
  document.querySelector('#indiv-email').style.display = 'none';


  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#indiv-email').style.display = 'none';


  // Show the mailbox name
  document.querySelector('#emails-view').innerHTML = `<h3>${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  //load incoming mail
  fetch(`/emails/${mailbox}`)
  .then(response => response.json())
  .then(emails => {
      // Print emails
      console.log(emails);
      // ... do something else with emails ...
      emails.forEach(list_email);
      //create a div and append data to it   
  })
}

//displaying a list of who the email is from, what the subject line is, and the timestamp of the email.
function list_email(email){
  //console.log(email);
  const mail = document.createElement('div');
  if (email.read===true){
    var mailhtml=`
      <div id="cursor" class="card bg-light">
      <div class="card-body">
        <h5 class="card-title">${email.subject}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${email.sender}</h6>
        <h6 class="card-subtitle mb-2 text-muted">${email.timestamp}</h6>
      </div>
    </div>
      `;
  } else {
    var mailhtml=`
      <div id="cursor" class="card">
      <div class="card-body">
        <h5 class="card-title">${email.subject}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${email.sender}</h6>
        <h6 class="card-subtitle mb-2 text-muted">${email.timestamp}</h6>
      </div>
    </div>
      `;
  }
  
  mail.insertAdjacentHTML('afterbegin',mailhtml);
  mail.addEventListener('click',function(){
    load_email(email);
  })
  document.querySelector('#emails-view').appendChild(mail);
}

  //for displaying individual emails that show the email’s sender, recipients, subject, timestamp, and body.
  //You’ll likely want to make a GET request to /emails/<email_id> to request the email ( DIDNT DO THIS )
  function load_email(indivemail){
    console.log(indivemail);
    document.querySelector('#emails-view').style.display = 'none';
    document.querySelector('#compose-view').style.display = 'none';
    document.querySelector('#indiv-email').style.display = 'block';
    const emaildisplay=document.createElement('div');
    
    if (indivemail.archived===true){
      var displayhtml=`
      <div class="card">
      <h5 class="card-header">${indivemail.subject} [ARCHIVED] </h5>
      <div class="card-body">
        <h5 class="card-title">Sender: ${indivemail.sender}</h5>
        <h5 class="card-title">Recipients: ${indivemail.recipients}</h5>
        <br>
        <h6 class="card-subtitle mb-2 text-muted">${indivemail.timestamp}</h6>
        <hr>
        <p class="card-text">${indivemail.body}</p>
        <a href="#" class="btn btn-light">Reply</a>
        <a id="unarchive" class="btn btn-light">Unarchive</a>
      </div>
    </div>
      `;
    } else {
          var displayhtml=`
    <div class="card">
    <h5 class="card-header">${indivemail.subject}</h5>
    <div class="card-body">
      <h5 class="card-title">Sender: ${indivemail.sender}</h5>
      <h5 class="card-title">Recipients: ${indivemail.recipients}</h5>
      <br>
      <h6 class="card-subtitle mb-2 text-muted">${indivemail.timestamp}</h6>
      <hr>
      <p class="card-text">${indivemail.body}</p>
      <a href="#" class="btn btn-light">Reply</a>
      <a id="archive" class="btn btn-light">Archive</a>
    </div>
  </div>
    `;
    }
    emaildisplay.insertAdjacentHTML('afterbegin',displayhtml);
    document.querySelector('#indiv-email').innerHTML="";
    document.querySelector('#indiv-email').appendChild(emaildisplay);

    //updating sql

    fetch(`/emails/${indivemail.id}`, {
      method: 'PUT',
      body: JSON.stringify({
          read: true
      })
    })

    //archive and unarchive buttons
    try{
        const unarchivebutton=document.querySelector('#unarchive');
                unarchivebutton.addEventListener('click',function(){
                  fetch(`/emails/${indivemail.id}`, {
                    method: 'PUT',
                    body: JSON.stringify({
                        archived: false
                    })
                  })
                  load_mailbox('inbox');
                })
    }
    catch(err){
      console.log("wrong page")
    }
    try{
        const archivebutton=document.querySelector('#archive');
            archivebutton.addEventListener('click',function(){
              fetch(`/emails/${indivemail.id}`, {
                method: 'PUT',
                body: JSON.stringify({
                    archived: true
                })
              })
              load_mailbox('archive');
            })
    }
    catch(err){
      console.log("wrong page")
    }
  }

function send_email(){
    const recipient= document.querySelector('#compose-recipients').value;
    const subject= document.querySelector('#compose-subject').value;
    const body= document.querySelector('#compose-body').value;
      fetch('/emails', {
        method: 'POST',
        body: JSON.stringify({
            recipients: recipient,
            subject: subject,
            body: body
        })
      })
      .then(response => response.json())
      .then(result => {
          // Print result
          console.log(result);
      });
      localStorage.clear();
      setTimeout(function(){ load_mailbox('sent'); }, 100)
      return false;
  }
