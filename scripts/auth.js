// // add admin cloud functions
// const adminForm = document.querySelector('.admin-actions');
// adminForm.addEventListener('submit', (e) => {
//   e.preventDefault();
//   const adminEmail = document.querySelector('#admin-email').value;
//   const addAdminRole = functions.httpsCallable('addAdminRole');
//   addAdminRole({ email : adminEmail }).then(result => {
//     console.log(result)
//   })
// })


// listen for auth status changes
auth.onAuthStateChanged(user => {
  if (user) {
    // user.getIdTokenResult().then(idTokenResult => {
    //   console.log(idTokenResult.claims.admin)
    // })
    // get data
    db.collection('guides').onSnapshot((snapshot) => {
      setupGuides(snapshot.docs);
      setupUI(user);
    }, err => console.log(err.message))
  } else {
    setupUI();
    setupGuides([]);
  }
})

// create new guide
const createForm = document.querySelector('#create-form');
createForm.addEventListener('submit', (e) => {
  e.preventDefault();
  db.collection('guides').add({
    title: createForm['title'].value,
    content: createForm['content'].value
  }).then(() => {
    // close the modal and reset form 
    const modal = document.querySelector('#modal-create');
    M.Modal.getInstance(modal).close();
    createForm.reset();
  }).catch(err => {
    console.log(err.message)
  })
})


// signup
const signupform = document.querySelector('#signup-form');
signupform.addEventListener('submit', (e) => {
  e.preventDefault();
  // get user info
  const email = signupform['signup-email'].value;
  const password = signupform['signup-password'].value;
  
  // sign up user
  auth.createUserWithEmailAndPassword(email, password).then(credentials => {
    return db.collection('users').doc(credentials.user.uid).set({
      bio: signupform['signup-bio'].value
    })
  }).then(() => {
    const modal = document.querySelector('#modal-signup');
    M.Modal.getInstance(modal).close();
    signupform.reset();
    signupform.querySelector('.error').innerHTML = '';
  }).catch(err => {
    signupform.querySelector('.error').innerHTML = err.message;
  })
});

// logout
const logout = document.querySelector('#logout');
logout.addEventListener('click', (e) => {
  e.preventDefault();
  auth.signOut();
});


// login
const loginform = document.querySelector('#login-form');
loginform.addEventListener('submit', (e) => {
  e.preventDefault();
  // get user info
  const email = loginform['login-email'].value;
  const password = loginform['login-password'].value;
  
  // sign up user
  auth.signInWithEmailAndPassword(email, password).then(credentials => {
    // console.log(credentials.user)
    const modal = document.querySelector('#modal-login');
    M.Modal.getInstance(modal).close();
    loginform.reset();
    loginform.querySelector('.error').innerHTML = '';
  }).catch(err => {
    loginform.querySelector('.error').innerHTML = err.message;
  })
});