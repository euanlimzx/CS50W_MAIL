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

  // Clear out composition fields
  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function load_mailbox(mailbox) {
  
  // Show the mailbox and hide other views
  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#compose-view').style.display = 'none';

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
  console.log(email.read);
  if (email.read===true){
    var mailhtml=`
      <div class="card bg-light">
      <div class="card-body">
        <h5 class="card-title">${email.subject}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${email.sender}</h6>
        <h6 class="card-subtitle mb-2 text-muted">${email.timestamp}</h6>
      </div>
    </div>
      `;
  } else {
    var mailhtml=`
      <div class="card">
      <div class="card-body">
        <h5 class="card-title">${email.subject}</h5>
        <h6 class="card-subtitle mb-2 text-muted">${email.sender}</h6>
        <h6 class="card-subtitle mb-2 text-muted">${email.timestamp}</h6>
      </div>
    </div>
      `;
  }
  

  mail.insertAdjacentHTML('afterbegin',mailhtml);
  document.querySelector('#emails-view').appendChild(mail);
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
      load_mailbox('sent');
      return false;
  }