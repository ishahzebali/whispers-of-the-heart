// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC9dRcokIZsWMZ25EgCxW_XS-MWZT8ctXw",
    authDomain: "whispers-of-the-heart.firebaseapp.com",
    projectId: "whispers-of-the-heart",
    storageBucket: "whispers-of-the-heart.appspot.com",
    messagingSenderId: "1083261439749",
    appId: "1:1083261439749:web:4882d2d4ace578f6a4716c",
    measurementId: "G-K5D6SG7MJH"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Google Authentication
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();

document.getElementById('login-button').addEventListener('click', () => {
    console.log("Login button clicked"); // Debugging line
    auth.signInWithPopup(provider)
        .then(result => {
            console.log(result.user);
            alert('Logged in successfully'); // Debugging line
        })
        .catch(error => {
            console.error(error);
            alert('Error logging in: ' + error.message); // Debugging line
        });
});

// Firestore setup
const db = firebase.firestore();

// Like button functionality
function likePoem(button) {
    const poemId = button.parentElement.dataset.poemId;
    const user = firebase.auth().currentUser;
    if (user) {
        const likesRef = db.collection('poems').doc(poemId).collection('likes').doc(user.uid);
        likesRef.get().then(doc => {
            if (doc.exists) {
                // User has already liked the poem
                likesRef.delete().then(() => {
                    updateLikesCount(poemId, button, -1);
                });
            } else {
                // User has not liked the poem yet
                likesRef.set({ liked: true }).then(() => {
                    updateLikesCount(poemId, button, 1);
                });
            }
        });
    } else {
        alert('You need to log in to like a poem.');
    }
}

function updateLikesCount(poemId, button, change) {
    const poemRef = db.collection('poems').doc(poemId);
    poemRef.get().then(doc => {
        if (doc.exists) {
            const likes = doc.data().likes || 0;
            const newLikes = likes + change;
            poemRef.update({ likes: newLikes }).then(() => {
                button.querySelector('span').textContent = newLikes;
                button.classList.toggle('liked', change > 0);
            });
        }
    });
}

// Fetch initial likes count for each poem
document.querySelectorAll('.poetry-item').forEach(poetryItem => {
    const poemId = poetryItem.dataset.poemId;
    const poemRef = db.collection('poems').doc(poemId);
    poemRef.get().then(doc => {
        if (doc.exists) {
            const likes = doc.data().likes || 0;
            poetryItem.querySelector('.like-button span').textContent = likes;
        }
    });
});

function copyGhazal(button) {
    const ghazalText = button.previousElementSibling.textContent;
    const tempTextarea = document.createElement('textarea');
    tempTextarea.value = ghazalText;
    document.body.appendChild(tempTextarea);
    tempTextarea.select();
    document.execCommand('copy');
    document.body.removeChild(tempTextarea);
    alert('Ghazal copied to clipboard!');
}
