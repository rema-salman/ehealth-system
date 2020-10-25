/**
 * Gets the user profile from backend app, using axios
 * then setsProfile .
 */

const getProfile = () => {
  axios
    .get('/users/me', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
    })
    .then(function(response) {
      // handle success
      console.log(response);
      setProfileInfo(response.data);
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .then(function() {
      // always executed
    });
};

/**
 * Gets the Researcher notes from backend app, using axios
 * then sets the notes .
 */
const getNotes = () => {
  axios
    .get('/users/notes', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
    })
    .then(function(response) {
      // handle success
      console.log(response);
      setNotes(response.data);
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .then(function() {
      // always executed
    });
};

const getPatients = () => {
  axios
    .get('/users/patients', {
      headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
    })
    .then(function(response) {
      // handle success
      console.log(response);
      setPatientsLocation(response.data);
    })
    .catch(function(error) {
      // handle error
      console.log(error);
    })
    .then(function() {
      // always executed
    });
};

/**
 * creat Researcher note backend app, using axios
 * then calls the getNotes.
 */
const createNote = note => {
  axios
    .post(
      '/users/notes',
      {
        note: note,
      },
      {
        headers: { Authorization: 'Bearer ' + localStorage.getItem('token') },
      },
    )
    .then(function(response) {
      // handle success
      M.toast({ html: 'Note created' });

      getNotes();
    })
    .catch(function(error) {
      // handle error
      console.log(error);

      M.toast({ html: error });
    })
    .then(function() {
      // always executed
    });
};
