/* =========================
   AUTHENTICATION
========================= */

let users =
JSON.parse(localStorage.getItem("users")) || [];

let currentUser =
JSON.parse(localStorage.getItem("currentUser")) || null;

/* =========================
   LOGIN PAGE FUNCTIONS
========================= */

const loginTab = document.getElementById("loginTab");
const registerTab = document.getElementById("registerTab");

if(loginTab && registerTab){

    loginTab.addEventListener("click", () => {

        document
        .getElementById("loginForm")
        .classList.remove("hidden");

        document
        .getElementById("registerForm")
        .classList.add("hidden");

        loginTab.classList.add("active");
        registerTab.classList.remove("active");
    });

    registerTab.addEventListener("click", () => {

        document
        .getElementById("registerForm")
        .classList.remove("hidden");

        document
        .getElementById("loginForm")
        .classList.add("hidden");

        registerTab.classList.add("active");
        loginTab.classList.remove("active");
    });

}

function register(){

    let users =
    JSON.parse(localStorage.getItem("users")) || [];

    const name =
    document.getElementById("regName")
    .value.trim();

    const email =
    document.getElementById("regEmail")
    .value.trim()
    .toLowerCase();

    const password =
    document.getElementById("regPassword")
    .value;

    if(!name || !email || !password){

        alert("Fill all fields");
        return;
    }

    const exists = users.find(
        user => user.email === email
    );

    if(exists){

        alert("Email already registered");
        return;
    }

    const user = {

        id: Date.now(),
        name,
        email,
        password
    };

    users.push(user);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert("Registration Successful");

    document.getElementById("regName").value="";
    document.getElementById("regEmail").value="";
    document.getElementById("regPassword").value="";

    document
    .getElementById("registerForm")
    .classList.add("hidden");

    document
    .getElementById("loginForm")
    .classList.remove("hidden");
}

function login(){

    const email =
    document.getElementById("loginEmail")
    .value.trim()
    .toLowerCase();

    const password =
    document.getElementById("loginPassword")
    .value;

    const users =
    JSON.parse(localStorage.getItem("users")) || [];

    const user = users.find(
        u =>
        u.email === email &&
        u.password === password
    );

    if(!user){

        console.log(users);

        alert("Invalid credentials");
        return;
    }

    localStorage.setItem(
        "currentUser",
        JSON.stringify(user)
    );

    alert("Login Successful");

    window.location.href =
    "dashboard.html";
}

function logout(){

    localStorage.removeItem(
        "currentUser"
    );

    window.location.href =
    "index.html";
}

/* =========================
   DASHBOARD DATA
========================= */

let clubs =
JSON.parse(localStorage.getItem("clubs")) || [];

let selectedClubId = null;

/* =========================
   LOAD DASHBOARD
========================= */

window.onload = function(){

    if(
        window.location.pathname
        .includes("dashboard")
    ){

        if(!currentUser){

            window.location.href =
            "index.html";

            return;
        }

        loadDashboard();
    }
};

function loadDashboard(){

    updateStats();
    renderClubs();
}

/* =========================
   CREATE CLUB
========================= */

function createClub(){

    const clubName =
    document.getElementById("clubName").value;

    const clubDescription =
    document.getElementById("clubDescription").value;

    if(!clubName){

        alert("Enter club name");
        return;
    }

    const club = {

        id: Date.now(),

        name: clubName,

        description: clubDescription,

        chairman: currentUser.name,

        domains: [],

        members: [],

        meetings: [],

        tasks: [],

        notes: []
    };

    clubs.push(club);

    saveClubs();

    document.getElementById("clubName").value="";
    document.getElementById("clubDescription").value="";
}

function saveClubs(){

    localStorage.setItem(
        "clubs",
        JSON.stringify(clubs)
    );

    updateStats();
    renderClubs();

    if(selectedClubId){

        openClub(selectedClubId);
    }
}

/* =========================
   RENDER CLUBS
========================= */

function renderClubs(){

    const container =
    document.getElementById("clubContainer");

    if(!container) return;

    container.innerHTML = "";

    clubs.forEach(club => {

        container.innerHTML += `

        <div class="club-card">

            <h3>${club.name}</h3>

            <p>${club.description}</p>

            <button
                onclick="openClub(${club.id})"
            >
                Open Club
            </button>

        </div>

        `;
    });
}

/* =========================
   OPEN CLUB
========================= */

function openClub(id){

    selectedClubId = id;

    const club =
    clubs.find(c => c.id === id);

    document
    .getElementById("clubDetails")
    .classList.remove("hidden");

    document
    .getElementById("selectedClubName")
    .innerText =
    club.name;

    document
    .getElementById("chairmanName")
    .innerText =
    club.chairman;

    renderDomains();
    renderMembers();
    renderMeetings();
    renderTasks();
    renderNotes();
}

/* =========================
   DOMAINS
========================= */

function addDomain(){

    const name =
    document.getElementById("domainName").value;

    if(!name) return;

    const club =
    clubs.find(
        c => c.id === selectedClubId
    );

    club.domains.push(name);

    document.getElementById(
        "domainName"
    ).value = "";

    saveClubs();
}

function renderDomains(){

    const club =
    clubs.find(
        c => c.id === selectedClubId
    );

    const container =
    document.getElementById("domainList");

    container.innerHTML = "";

    club.domains.forEach(domain => {

        container.innerHTML += `

        <div class="domain-item">

            ${domain}

        </div>

        `;
    });
}

/* =========================
   MEMBERS
========================= */

function addMember(){

    const name =
    document.getElementById("memberName").value;

    const role =
    document.getElementById("memberRole").value;

    if(!name) return;

    const club =
    clubs.find(
        c => c.id === selectedClubId
    );

    club.members.push({
        name,
        role
    });

    document.getElementById(
        "memberName"
    ).value = "";

    saveClubs();
}

function renderMembers(){

    const club =
    clubs.find(
        c => c.id === selectedClubId
    );

    const container =
    document.getElementById("memberList");

    container.innerHTML = "";

    club.members.forEach(member => {

        container.innerHTML += `

        <div class="member-item">

            <strong>${member.name}</strong>

            <br>

            ${member.role}

        </div>

        `;
    });
}

/* =========================
   MEETINGS
========================= */

function addMeeting(){

    const title =
    document.getElementById("meetingTitle").value;

    const date =
    document.getElementById("meetingDate").value;

    const agenda =
    document.getElementById("meetingAgenda").value;

    if(!title) return;

    const club =
    clubs.find(
        c => c.id === selectedClubId
    );

    club.meetings.push({
        title,
        date,
        agenda
    });

    document.getElementById("meetingTitle").value="";
    document.getElementById("meetingDate").value="";
    document.getElementById("meetingAgenda").value="";

    saveClubs();
}

function renderMeetings(){

    const club =
    clubs.find(
        c => c.id === selectedClubId
    );

    const container =
    document.getElementById("meetingList");

    container.innerHTML = "";

    club.meetings.forEach(meeting => {

        container.innerHTML += `

        <div class="meeting-item">

            <strong>${meeting.title}</strong>

            <br>

            ${meeting.date}

            <br>

            ${meeting.agenda}

        </div>

        `;
    });
}

/* =========================
   TASKS
========================= */

function addTask(){

    const title =
    document.getElementById("taskTitle").value;

    const assignedTo =
    document.getElementById("assignedTo").value;

    const status =
    document.getElementById("taskStatus").value;

    if(!title) return;

    const club =
    clubs.find(
        c => c.id === selectedClubId
    );

    club.tasks.push({

        title,
        assignedTo,
        status
    });

    document.getElementById("taskTitle").value="";
    document.getElementById("assignedTo").value="";

    saveClubs();
}

function renderTasks(){

    const club =
    clubs.find(
        c => c.id === selectedClubId
    );

    const container =
    document.getElementById("taskList");

    container.innerHTML = "";

    club.tasks.forEach(task => {

        container.innerHTML += `

        <div class="task-item">

            <strong>${task.title}</strong>

            <br>

            Assigned To:
            ${task.assignedTo}

            <br>

            Status:
            ${task.status}

        </div>

        `;
    });
}

/* =========================
   NOTES
========================= */

function saveNotes(){

    const text =
    document.getElementById("meetingNotes").value;

    if(!text) return;

    const club =
    clubs.find(
        c => c.id === selectedClubId
    );

    club.notes.push(text);

    document.getElementById(
        "meetingNotes"
    ).value = "";

    saveClubs();
}

function renderNotes(){

    const club =
    clubs.find(
        c => c.id === selectedClubId
    );

    const container =
    document.getElementById("notesList");

    container.innerHTML = "";

    club.notes.forEach(note => {

        container.innerHTML += `

        <div class="note-item">

            ${note}

        </div>

        `;
    });
}

/* =========================
   AI INSIGHTS
========================= */

function generateInsights(){

    const club =
    clubs.find(
        c => c.id === selectedClubId
    );

    const insights = [];

    if(club.members.length < 5){

        insights.push(
        "Recruit more members to improve engagement.");
    }

    if(club.tasks.length < 3){

        insights.push(
        "Very few tasks are being assigned.");
    }

    if(club.meetings.length < 2){

        insights.push(
        "Schedule meetings regularly.");
    }

    const completed =
    club.tasks.filter(
        task => task.status === "Completed"
    ).length;

    if(
        club.tasks.length > 0 &&
        completed / club.tasks.length < 0.5
    ){

        insights.push(
        "Task completion rate is low. Break tasks into smaller milestones.");
    }

    if(insights.length === 0){

        insights.push(
        "Club is performing well. Continue maintaining engagement.");
    }

    const container =
    document.getElementById("aiInsights");

    container.innerHTML = "";

    insights.forEach(item => {

        container.innerHTML += `

        <div class="insight">

            ${item}

        </div>

        `;
    });
}

/* =========================
   STATS
========================= */

function updateStats(){

    const clubCount =
    document.getElementById("clubCount");

    const meetingCount =
    document.getElementById("meetingCount");

    const taskCount =
    document.getElementById("taskCount");

    const healthScore =
    document.getElementById("healthScore");

    if(!clubCount) return;

    let totalMeetings = 0;
    let totalTasks = 0;

    clubs.forEach(club => {

        totalMeetings +=
        club.meetings.length;

        totalTasks +=
        club.tasks.length;
    });

    clubCount.innerText =
    clubs.length;

    meetingCount.innerText =
    totalMeetings;

    taskCount.innerText =
    totalTasks;

    let score = 50;

    score += clubs.length * 5;
    score += totalMeetings * 2;
    score += totalTasks * 2;

    if(score > 100){
        score = 100;
    }

    healthScore.innerText =
    score + "%";
}
