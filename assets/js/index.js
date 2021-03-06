const electron = require("electron");
const { ipcRenderer } = electron;

var myNote;


let txtWriteNote = document.querySelector('#idWriteNote');
let btnAddWritedNote = document.querySelector('#idBtnAddWritedNote');
btnAddWritedNote.addEventListener("click", ()=>{
    ipcRenderer.send("indexhtml->mainjs:writedNote", txtWriteNote.value)
})

let btnLogin = document.querySelector('#idBtnLogin');
btnLogin.addEventListener("click", ()=>{
    ipcRenderer.send("indexhtml->mainjs:btnLogin",true);
})

//main->index veri akışı
ipcRenderer.on("mainjs->indexhtml:note", (err,note) =>{
    myNote = note.note;
    fncDrawNoteRow(myNote);
})



function fncDrawNoteRow(data){
    //çizdirmek
    const notesContainer = document.querySelector(".notesContainer");

    const row = document.createElement("div");
    row.className = "row"

    const col = document.createElement("div");
    col.className = "col";

    const p = document.createElement("p");
    p.className = "myNote";
    p.innerText = data;

    const btnNoteErase = document.createElement("button");
    btnNoteErase.className = "btnNoteErase";
    btnNoteErase.innerText = "X";

    //sil butonu tıklanması
    btnNoteErase.addEventListener("click", ()=>{
        if(confirm("Bu notu silmek istiyor musun?")){
            //silme islemi
        }
    })

    //birleştir
    col.appendChild(p);
    col.appendChild(btnNoteErase);
    row.appendChild(col);
    notesContainer.appendChild(row);

    fncCheckNoteCount();
}

function fncCheckNoteCount(){
    const notesContainer = document.querySelector(".notesContainer");
    const warnNote = document.querySelector(".warnNote");

    if(notesContainer.children.length !== 0){
        warnNote.style.display = "none"
    }else{
        warnNote.style.display = "block"
    }
    var noteCount = document.querySelector("#idNoteCount")
    noteCount.innerText = (notesContainer.children.length-1);
}

