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
