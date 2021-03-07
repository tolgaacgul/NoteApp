const electron = require("electron");
const { ipcRenderer } = electron;


let txtWriteNote = document.querySelector('#idWriteNote');
let btnAddWritedNote = document.querySelector('#idBtnAddWritedNote');
btnAddWritedNote.addEventListener("click", ()=>{
    ipcRenderer.send("indexhtml->mainjs:writedNote", {ref: "index", txtValue:txtWriteNote.value});
    txtWriteNote.value = "";
})

let btnLogin = document.querySelector('#idBtnLogin');
btnLogin.addEventListener("click", ()=>{
    ipcRenderer.send("indexhtml->mainjs:btnLogin",true);
})

//main->index note veri akışı
ipcRenderer.on("mainjs->indexhtml:obj", (err,data) =>{
    fncDrawNoteRow(data);
})

//DB data select
ipcRenderer.on("mainjs->indexhtml:db_init", (error, data)=>{
    //console.log(data);
    data.forEach(item => {
        fncDrawNoteRow(item)
    });
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
    p.innerText = data.note;

    const btnNoteErase = document.createElement("button");
    btnNoteErase.className = "btnNoteErase";
    btnNoteErase.innerText = "X";
    btnNoteErase.setAttribute("note_id", data.id)

    //birleştir
    col.appendChild(p);
    col.appendChild(btnNoteErase);
    row.appendChild(col);
    notesContainer.appendChild(row);

    //sil butonu tıklanması
    btnNoteErase.addEventListener("click", (e)=>{
        if(confirm("Bu notu silmek istiyor musun?")){
            //db'den silme
            ipcRenderer.send("indexhtml->mainjs:db_remove_note", e.target.getAttribute("note_id"))
            //silme islemi
            e.target.parentNode.parentNode.remove();
            fncCheckNoteCount();
        }
    })
    fncCheckNoteCount();
}

fncCheckNoteCount();
function fncCheckNoteCount(){
    const notesContainer = document.querySelector(".notesContainer");
    const warnNote = document.querySelector(".warnNote");

    if(notesContainer.children.length !== 1){
        warnNote.style.display = "none"
    }else{
        warnNote.style.display = "block"
    };

    var noteCount = document.querySelector("#idNoteCount")
    noteCount.innerText = notesContainer.children.length-1;
}

