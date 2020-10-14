document.addEventListener('DOMContentLoaded', function() {
  M.Sidenav.init(document.querySelectorAll('.sidenav'));
  M.Modal.init(document.querySelectorAll('.modal'));
  M.Tabs.init(document.querySelectorAll('.tabs'));
});

/**
 * Sets PROFILE Info, Sections for each Role,
 *  in Sidebar
 * @param  {Object} data object from the backend
 */
const setProfileInfo = data => {
  document.getElementById('profileName').innerHTML =
    '<b>' +
    data.username +
    '</b> (' +
    data.role.name +
    ',' +
    data.organization.name +
    ')';
  document.getElementById('profileEmail').innerHTML = data.email;

  // Add buttons according to role
  if (data.Role_IDrole == 1) {
    addToSideMenu(
      '<li><a href="#!" onclick="showSection(\'youtube\')">Youtube videos</a></li>',
    );
    addToSideMenu(
      '<li><a  href="#!" onclick="showSection(\'myTherapySessions\')"> My therapy sessions</a></li>',
    );
  } else if (data.Role_IDrole == 2 || data.Role_IDrole == 3) {
    addToSideMenu(
      '<li><a href="#!" onclick="showSection(\'Mypatients\')">My patients</a></li>',
    );
    addToSideMenu(
      '<li><a href="#!" onclick="showSection(\'Allpatients\')">All patients</a></li>',
    );
    if (data.Role_IDrole == 3) {
      addToSideMenu(
        '<li><a href="#news" onclick="showSection(\'rss\')">RSS</a></li>',
      );
    }
  }
  addToSideMenu('<li><div class="divider"></div></li>');
  addToSideMenu(
    '<li><a class="waves-effect" href="#!" onclick="logout()">Logout</a></li>',
  );
  renderFeed(data.feed);
};

/**
 * ADD html elements to Sidebar
 * @param  {HTML} html Html element
 */
const addToSideMenu = html => {
  document.getElementById('slide-out').innerHTML =
    document.getElementById('slide-out').innerHTML + html;
};

/**
 * Renders corresponding function according to the data
 * @param  {Object} feed object from backend response
 */
const renderFeed = feed => {
  for (var key in feed) {
    if (key == 'youtube') {
      renderYoutube(feed[key]);
      showSection('youtube');
    } else if (key == 'myTherapySessions') {
      renderMySessions(feed[key], 'My Therapy Sessions');
    } else if (key == 'rss') {
      renderRss(feed[key]);
    } else if (key == 'myTherapies') {
      renderPatients(feed[key], 'My patients');
      showSection('Mypatients');
    } else if (key == 'therapies') {
      renderPatients(feed[key], 'All patients');
    }
  }
};

const addToContainer = html => {
  document.getElementById('container').innerHTML =
    document.getElementById('container').innerHTML + html;
};

const addModal = html => {
  document.getElementById('modals').innerHTML =
    document.getElementById('modals').innerHTML + html;
};

const addSection = (html, id) => {
  addToContainer(
    `<div id="${id}" class="section">
      ${html}
      </div>
    `,
  );
};

const showSection = id => {
  const sections = document.querySelectorAll('.section');
  for (var i = 0; i < sections.length; i++) {
    sections[i].style.display = 'none';
  }
  document.getElementById(id).style.display = 'block';
};

const renderRss = rss => {
  addSection(
    `
    <div class="row">
      ${rss
        .map(article => {
          return `
          <div class="col s12 m6">
            <div class="card"> 
              <div class="card-image"> 
                <img src=${article.image} />  
                  <span class="card-title">
                  ${article.title.replace(/<[^>]*>?/gm, '')}
                  </span>    
              </div>
              <div class="card-content">
                <p>${article.description.replace(/<[^>]*>?/gm, '')}</p>
              </div>
              <div class="card-action">
                <a href=${article.link} target="_blank">Read Full article</a>
              </div>
            </div>
          </div>
          `;
        })
        .join('')}

    </div>
    `,
    'rss',
  );
};

const renderPatients = (therapies, title) => {
  addSection(
    `
  <h1>${title}</h1>
  <table class="table">
  ${therapies
    .map(therapy => {
      return `
      <tr>
        <td>${therapy.patient.username}</td>
        <td>${therapy.patient.email}</td>
        <td>${therapy.patient.organization.name}</td>
        <td>
          <a class="btn modal-trigger" href="#${title.trim().replace(' ', '') +
            therapy.therapyID}" >
            View Therapy
          </a>
        </td>
      </tr>
    `;
    })
    .join('')}
  </table>
  ${therapies.length == 0 ? `<h6>You dont have any patients</h6>` : ''}
  `,
    title.trim().replace(' ', ''),
  );

  addModal(
    therapies
      .map(therapy =>
        rednerMedicTherapyModal(
          therapy,
          title.trim().replace(' ', '') + therapy.therapyID,
        ),
      )
      .join(''),
  );

  for (var i = 0; i < therapies.length; i++) {
    for (var j = 0; j < therapies[i].tests.length; j++) {
      for (var z = 0; z < therapies[i].tests[j].testSessions.length; z++) {
        var id = title.trim().replace(' ', '') + therapies[i].therapyID;
        visualiseData(
          '#' + id + therapies[i].tests[j].testSessions[z].DataURL,
          therapies[i].tests[j].testSessions[z].data,
        );
      }
    }
  }

  M.Modal.init(document.querySelectorAll('.modal'));
  M.Tabs.init(document.querySelectorAll('.tabs'));
  console.log('init modals');
};

const rednerMedicTherapyModal = (therapy, id) => {
  return `
  <!-- Modal Structure -->
  <div id="${id}" class="modal">
    <div class="modal-content">
      <h4>${therapy.patient.username}</h4>
      
      <div class="row">
          <div class="col s12">
            <ul class="tabs">
              <li class="tab col s3"><a href="#${id}test1">Responsable data</a></li>
              <li class="tab col s3"><a href="#${id}test3">Therapy info</a></li>
              <li class="tab col s3"><a href="#${id}test4">Tests</a></li>
            </ul>
          </div>

          <div id="${id}test1" class="col s12">
            <p><b> Patient Responsable: </b></p>
            <table class="table">
            <tr>
            <td>
              ${therapy.medic.username} 
            </td> 
            <td>
              ${therapy.medic.email} 
            </td>
            </tr> 
            </table>
          </div>

          <div id="${id}test3" class="col s12">
          ${renderTheraphyList(therapy.theraphyList)}
          </div>

          <div id="${id}test4" class="col s12">
          ${renderTests(therapy.tests, id)}
          </div>
      </div>
    </div> 
    
      <div class="modal-footer">
        <a href="#!" class="modal-close waves-effect waves-green btn-flat">Close</a>
      </div>
 
  </div>
  `;
};

const renderTheraphyList = theraphyList => {
  return `

  <br><br>
  <h5> Medication: </h5>
  ${theraphyList
    .map(therapyElem => {
      return `
      <div class="row">
        <div class="col s12">
   
            ${therapyElem.name} 
  
        </div>
      </div>
      
       <p><b> Dosage: </b></p>
  
      <div class="row">
        <div class="col s6">
        ${therapyElem.Dosage}  
        </div>
        <div class="col s6">
        ${renderMedicines(therapyElem.medicines)} 
        </div>
      </div>
      
    `;
    })
    .join('')}

  `;
};

const renderMedicines = medicines => {
  if (medicines.length == 0) return '';
  return `${medicines
    .map(medicine => {
      return ` 
     ${medicine.name}`;
    })
    .join('')}`;
};

const renderTests = (tests, id) => {
  if (tests.length == 0) return '';
  return `
  <div class="row">
    <div class="col s12">
    <h5> Tests: </h5> 
    ${tests
      .map(test => {
        return ` 
        <div class="row">
          <div class="col s12">
            <br>  
            <div class="divider"></div>
            <br>
          </div>
        </div>
        <div class="row">
          <div class="col s6">
          <h5>Test ${test.testID}</h5>
          </div>
          <div class="col s6">
              ${test.dateTime}
          </div>
        </div>
        <div class="row">
          <div class="col s12">
            ${getTestSessions(test.testSessions, id)}
          </div>
        </div>
        `;
      })
      .join('')}  
  </div>
    `;
};

/**
 * Renders the notes, using cards from materialize
 * @param {Array} testSessions - An array of testSessions
 * @param {String} id - therapyID for this testSession
 * @returns {HTMLElement}
 */
const getTestSessions = (testSessions, id) => {
  if (testSessions.length == 0) return '';
  return `
  
    <p><b>Test seesions Data </b></p>
  ${testSessions
    .map(testSession => {
      return `
      <div class="row">
      <br><br>
        <div class="col s6">  
          <p> ${testSession.DataURL} </p>
        </div>

        <div class="col s6">
            <a class="btn" href="/files/${
              testSession.DataURL
            }">Download .csv data</a>
        </div> <br><br>
      </div>

      <div class="row">
        <div class="col s12">
        <div id="${id + testSession.DataURL}"></div>
        </div>
      </div>
      
      <div class="row">
        <div class="col s12">
        ${renderNotes(testSession.notes)}
        </div>
      </div>
    `;
    })
    .join('')}
 
   
    `;
};

/**
 * Renders the notes, using cards from materialize
 * @param {Array} notes - An array of notes
 * @returns {HTMLElement}
 */
const renderNotes = notes => {
  if (notes.length == 0) return '';
  return `
  <p><b>Test seesions Notes</b></p>
  ${notes
    .map(note => {
      return `
      <div  class="card">
       <div class=" card-content">
        <b> ${note.medic.username}: </b>
        <i>${note.note}</i>
       </div> 
      </div>`;
    })
    .join('')}`;
};

/**
 * Renders the patient therapy sessions,
 * using tabs from materialize
 * @param {Array} therapies - An array of therapy setions
 * @param {String} title - Title for the section
 * @returns {HTMLElement}
 */
const renderMySessions = (therapies, title) => {
  addSection(
    `
  <h1>${title}</h1>
  ${therapies
    .map(therapy => {
      return `
        <h4> Thrapy ${therapy.therapyID}</h4>    
        ${rednerMedicTherapy(
          therapy,
          title.trim().replaceAll(' ', '') + therapy.therapyID,
        )}`;
    })
    .join('')}
  ${therapies.length == 0 ? `<h6>You dont have any Sessions</h6>` : ''}
  `,
    'myTherapySessions',
  );

  M.Tabs.init(document.querySelectorAll('.tabs'));

  for (var i = 0; i < therapies.length; i++) {
    for (var j = 0; j < therapies[i].tests.length; j++) {
      for (var z = 0; z < therapies[i].tests[j].testSessions.length; z++) {
        var id = title.trim().replaceAll(' ', '') + therapies[i].therapyID;
        visualiseData(
          '#' + id + therapies[i].tests[j].testSessions[z].DataURL,
          therapies[i].tests[j].testSessions[z].data,
        );
      }
    }
  }
};

/**
 * Renders 3 tabs for responsable, therapy info, and tests,
 * using tabs from materialize
 * @param {Object} therapy - An object of a therapy session
 * @param {String} id - TherapyID without spacing for this therapy
 * @returns {HTMLElement}
 */
const rednerMedicTherapy = (therapy, id) => {
  return `
      <div id="${id}" class="row">
          <div class="col s12">
            <ul class="tabs">
              <li class="tab col s3"><a href="#${id}test1">Responsable data</a></li>
              <li class="tab col s3"><a href="#${id}test3">Therapy info</a></li>
              <li class="tab col s3"><a href="#${id}test4">Tests</a></li>
            </ul>
          </div>
          <div id="${id}test1" class="col s12">
          <p><b> Patient Responsable: </b></p>
              <table class="table">
                <tr>
                  <td>
                    ${therapy.medic.username} 
                  </td> 
                  <td>
                    ${therapy.medic.email} 
                  </td>
                </tr> 
              </table>
          </div>
          <div id="${id}test3" class="col s12">
          ${renderTheraphyList(therapy.theraphyList)}
          </div>
          <div id="${id}test4" class="col s12"> 
          ${renderTests(therapy.tests, id)}
          </div>
    </div>
  `;
};

/**
 * Renders the youtube videos using cards from materialize
 * @param {Array} youtube - An array of youtube
 * @returns {HTMLElement}
 */
const renderYoutube = youtube => {
  addSection(
    `
  <div class="row">
  ${youtube
    .map(video => {
      return `
        <div class="col s12 m6">
          <div class="card">
            <div class="card-image">
                <img src= ${video.snippet.thumbnails.medium.url}>
                    <a class="btn-floating halfway-fab waves-effect waves-light red"
                    href=" https://www.youtube.com/watch?v=${video.id.videoId}"
                    target="_blank" >
                          <i class="material-icons"> play_circle_filled </i>
                    </a>
              </div>
              <div class="card-content">
                  <p>${video.snippet.title}</p>
              </div>
            </div>
        </div>
      `;
    })
    .join('')}
    </div>
    `,
    'youtube',
  );
};
