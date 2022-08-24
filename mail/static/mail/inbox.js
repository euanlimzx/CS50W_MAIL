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
      //for each emails
      //create a div and append data to it 
      var div = document.createElement('div');
      div.innerHTML=<h1>//body placeholder</h1>;
      document.getElementById('emails-view').appendChild(div);



  });
}

function send_email(){
  const recipient= document.querySelector('#compose-recepients').value;
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