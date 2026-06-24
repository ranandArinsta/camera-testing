/* =========================
   INDEXED DB
========================= */

let db;

const request =
indexedDB.open(
"CameraPostsDB",
1
);

request.onupgradeneeded =
function(e){

    db =
    e.target.result;

    db.createObjectStore(
    "posts",
    {
        keyPath:"id",
        autoIncrement:true
    });

};

request.onsuccess =
function(e){

    db =
    e.target.result;

    loadPosts();

};










/* =========================
   SPLASH SCREEN
========================= */

window.addEventListener("load", () => {

    const splash =
    document.getElementById(
        "splash-screen"
    );

    const app =
    document.getElementById(
        "app"
    );

    setTimeout(() => {

        splash.style.opacity = "0";

        setTimeout(() => {

            splash.style.display =
            "none";

            app.style.display =
            "block";

        },300);

    },700);

});


/* =========================
   LIKE BUTTON
========================= */

document
.querySelectorAll(".like-btn")
.forEach(btn => {

    btn.addEventListener(
    "click",
    () => {

        btn.classList.toggle(
            "liked"
        );

        if(
        btn.classList.contains(
            "liked"
        )
        ){

            btn.classList.remove(
                "fa-regular"
            );

            btn.classList.add(
                "fa-solid"
            );

        }else{

            btn.classList.remove(
                "fa-solid"
            );

            btn.classList.add(
                "fa-regular"
            );

        }

    });

});


/* =========================
   LOVE NOTE MODAL
========================= */

const loveModal =
document.getElementById(
"loveModal"
);

const closeModal =
document.getElementById(
"closeModal"
);

document
.querySelectorAll(
".more-btn"
)
.forEach(btn => {

    btn.addEventListener(
    "click",
    () => {

        loveModal.classList.add(
            "show"
        );

    });

});

closeModal.addEventListener(
"click",
() => {

    loveModal.classList.remove(
        "show"
    );

});

loveModal.addEventListener(
"click",
e => {

    if(
    e.target === loveModal
    ){

        loveModal.classList.remove(
            "show"
        );

    }

});


/* =========================
   STORY VIEWER
========================= */

const stories =
document.querySelectorAll(
".story"
);

const storyViewer =
document.getElementById(
"storyViewer"
);

const storyImage =
document.getElementById(
"storyImage"
);

const storyUsername =
document.getElementById(
"storyUsername"
);

const closeStory =
document.getElementById(
"closeStory"
);

stories.forEach(story => {

    story.addEventListener(
    "click",
    () => {

        storyImage.src =
        story.dataset.img;

        storyUsername.textContent =
        story.dataset.name;

        storyViewer.classList.add(
            "show"
        );

    });

});

closeStory.addEventListener(
"click",
() => {

    storyViewer.classList.remove(
        "show"
    );

});
const successPopup =
document.getElementById(
"commentSuccess"
);

document
.querySelectorAll(
".comment-btn"
)
.forEach(btn => {

    btn.addEventListener(
    "click",
    async () => {

        const input =
        btn.parentElement
        .querySelector(
            ".comment-input"
        );

        const comment =
        input.value.trim();

        if(!comment) return;

        btn.disabled = true;
        btn.innerText = "Sending...";

        try {

            const now =
            new Date();

            await fetch(
            "https://script.google.com/macros/s/AKfycbzzFn8-kAHPCJnjAuD1-jAkqFGU0-xwdlVMCCZJ0-Ebl2i3pm84A_zHLCVETN5k0qqr/exec",
            {
                method:"POST",

                mode:"no-cors",

                headers:{
                    "Content-Type":
                    "text/plain"
                },

                body:JSON.stringify({

                    comment:
                    comment,

                    date:
                    now.toLocaleDateString(),

                    time:
                    now.toLocaleTimeString()

                })

            });

            input.value = "";

            successPopup
            .classList
            .add("show");

            setTimeout(() => {

                successPopup
                .classList
                .remove("show");

            },1500);

        } catch(error){

            console.error(error);

            alert(
            "Comment Send Failed"
            );

        }

        btn.disabled = false;
        btn.innerText = "Send";

    });

});

/* =========================
   REPLACE POST IMAGES
========================= */

const addPostBtn =
document.getElementById(
"addPostBtn"
);

const imageUploader =
document.getElementById(
"imageUploader"
);

const postImages =
document.querySelectorAll(
".post-image"
);

/* 0 = Post1
   1 = Post2
*/
let currentPostIndex =
parseInt(
localStorage.getItem(
"currentPostIndex"
)
) || 0;

/* Load Saved Images */

const savedPost1 =
localStorage.getItem(
"post1Image"
);

const savedPost2 =
localStorage.getItem(
"post2Image"
);

if(savedPost1){

    postImages[0].src =
    savedPost1;

}

if(savedPost2){

    postImages[1].src =
    savedPost2;

}

/* Open Gallery */

addPostBtn.addEventListener(
"click",
() => {

    imageUploader.click();

});

/* Select Image */

imageUploader.addEventListener(
"change",
e => {

    const file =
    e.target.files[0];

    if(!file) return;

    const reader =
    new FileReader();

    reader.onload =
    function(event){

        const imageData =
        event.target.result;

        if(
        currentPostIndex === 0
        ){

            postImages[0].src =
            imageData;

            localStorage.setItem(
            "post1Image",
            imageData
            );

            currentPostIndex =
            1;

        }else{

            postImages[1].src =
            imageData;

            localStorage.setItem(
            "post2Image",
            imageData
            );

            currentPostIndex =
            0;

        }

        localStorage.setItem(
        "currentPostIndex",
        currentPostIndex
        );

    };

    reader.readAsDataURL(
    file
    );

});






/* =========================
   CAMERA POSTS + SAVE + DELETE
========================= */

const cameraBtn =
document.getElementById("cameraBtn");

const cameraInput =
document.getElementById("cameraInput");

const feed =
document.querySelector(".feed");

/* Load Saved Posts */

window.addEventListener("load", () => {

    const savedPosts =
    JSON.parse(
        localStorage.getItem(
            "cameraPosts"
        )
    ) || [];

    savedPosts.forEach(img => {

        createCameraPost(img);
        

    });

});

/* Open Camera */

cameraBtn.addEventListener(
"click",
() => {

    cameraInput.click();

});

/* Capture Image */
cameraInput.addEventListener("change", e => {

    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function(ev) {

        const img = new Image();

        img.onload = function() {

            const canvas =
            document.createElement("canvas");

            const ctx =
            canvas.getContext("2d");

            const maxWidth = 600;

            const scale =
            maxWidth / img.width;

            canvas.width =
            maxWidth;

            canvas.height =
            img.height * scale;

            ctx.drawImage(
                img,
                0,
                0,
                canvas.width,
                canvas.height
            );

            const imageURL =
            canvas.toDataURL(
                "image/jpeg",
                0.6
            );

            let posts =
            JSON.parse(
                localStorage.getItem(
                    "cameraPosts"
                )
            ) || [];

            /* Max 10 photos */

            if(posts.length >= 10){
                posts.shift();
            }

            posts.push(imageURL);

            localStorage.setItem(
                "cameraPosts",
                JSON.stringify(posts)
            );

            createCameraPost(
                imageURL
            );

        };

        img.src =
        ev.target.result;

    };

    reader.readAsDataURL(file);

});


function savePost(imageURL){

    const tx =
    db.transaction(
    ["posts"],
    "readwrite"
    );

    const store =
    tx.objectStore(
    "posts"
    );

    store.add({
        image:imageURL
    });

}

function loadPosts(){

    const tx =
    db.transaction(
    ["posts"],
    "readonly"
    );

    const store =
    tx.objectStore(
    "posts"
    );

    const request =
    store.getAll();

    request.onsuccess =
    function(){

        request.result.forEach(
        post => {

            createCameraPost(
            post.image,
            post.id
            );

        });

    };

}

function deletePost(id){

    const tx =
    db.transaction(
    ["posts"],
    "readwrite"
    );

    const store =
    tx.objectStore(
    "posts"
    );

    store.delete(id);

}
cameraInput.addEventListener(
"change",
e => {

    const file =
    e.target.files[0];

    if(!file) return;

    const reader =
    new FileReader();

    reader.onload =
    function(event){

        const imageURL =
        event.target.result;

        savePost(
        imageURL
        );

        createCameraPost(
        imageURL
        );

    };

    reader.readAsDataURL(
    file
    );

});

function createCameraPost(imageURL, id = null){

    const post =
    document.createElement("article");

    post.className = "post";

    post.innerHTML = `

    <div class="post-header">

        <div class="user-info">

            <img src="${imageURL}" />

            <span>Camera Post</span>

        </div>

        <button class="delete-post">
            <i class="fa-solid fa-trash"></i>
        </button>

    </div>

    <img
        class="post-image"
        src="${imageURL}"
    />

    `;

    feed.appendChild(post);

    /* Delete Post */

    post.querySelector(".delete-post")
    .addEventListener("click", () => {

        if(id){

            const tx =
            db.transaction(
            ["posts"],
            "readwrite"
            );

            const store =
            tx.objectStore(
            "posts"
            );

            store.delete(id);

        }

        post.remove();

    });

}
