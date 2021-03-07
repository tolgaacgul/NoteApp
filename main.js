const electron = require("electron");
const url = require("url");
const path = require("path");
const { createConnection } = require("net");
const { app, BrowserWindow, Menu, ipcMain} = electron;
const db = require("./assets/lib/connection").db;

let htmlIndex, htmlLogin, obj;
let arrayObj = [];

//uygulama  hazır olduğunda
app.on('ready', () => {
    fncHtmlIndex();
    fncActiveMainMenu();

    //htmlIndex domları yüklendiğinde 1kereye mahsus...
    htmlIndex.webContents.once("dom-ready", ()=>{
        db.query("SELECT * FROM tb_notes", (error, data, fields)=>{
            //console.log(data)
            htmlIndex.webContents.send("mainjs->indexhtml:db_init", data)
        })
    })

    //DB:note sil
    ipcMain.on("indexhtml->mainjs:db_remove_note", (error, note_id)=>{
        console.log("silinen not id: " + note_id);
        db.query("DELETE FROM tb_notes WHERE id = ?", note_id, (e,r,d)=>{
            if(r.affectedRows > 0){
                console.log(note_id + " numarıl not silindi.")
            }
        })
    })

    //index.html den Note'u oku
    ipcMain.on("indexhtml->mainjs:writedNote", (err, data) => {
        if(data){    
            if(data.ref == "index"){
                obj =  {
                    id: arrayObj.length + 1,
                    u_id: 334,
                    note: data.txtValue //data'dan txtValue objesi
                };
                arrayObj.push(obj);
                //main'den index'e veri gonderimi
                htmlIndex.webContents.send("mainjs->indexhtml:obj", obj)
                
                db.query("INSERT INTO `tb_notes` (`id`, `u_id`, `note`) VALUES (NULL, '334', ?)", data.txtValue ,(e,r,f)=>{
                    if(e){
                        console.log("MYSQL HATASI: " + e)
                    }else{
                        console.log("MYSQL :INSERT işlemi başarılı ")   
                    }
                })

            }else{
                //addhtml.close();
                //addhtml = null;
            }
        }
        console.log(arrayObj)
    });
    //index.html den login isteği
    ipcMain.on("indexhtml->mainjs:btnLogin", () =>{
        fncHtmlLogin();
    })
    //login.html vazgeçme
    ipcMain.on("channel:htmlLogin-cancel",()=>{
        htmlLogin.close();
        htmlLogin = null;
    })
});

//Ana menu Şablonu
const mainMenuTemplate = [
    {
        label : "NoteApp",
        submenu : [
            {
                label : "Giriş Yap",
                click(){
                    fncHtmlLogin();
                }
            },
            {
                label : "Kayıt Ol"
            },
            {
                label : "Reload",
                role : "reload"
            },
            {
                label : "Çıkış",
                accelerator : process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
                role : "quit"
            }
        ]
    },
    {
        label : "Not",
        submenu : [
            {
                label : "Not Ekle"
            },
            {
                label : "Not Listele"
            },
            {
                label : "Not Düzenle"
            }
        ]
    }
]
if(process.platform == "darwin"){
    mainMenuTemplate.unshift(
        {
            label : app.getName(),
            role : "TODO"
        }
    )
}
if(process.env.NODE_ENV !== "production"){
    mainMenuTemplate.push(
        {
            label : "Dev Tools",
            submenu : [
                {
                    label : "Toggle Dev Tools",
                    click(item, focusedWindow){
                        focusedWindow.toggleDevTools();
                    }
                }
            ]
        }
    )
}

//Fonksiyonlar
function fncActiveMainMenu(){
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
}
function fncHtmlIndex(){
    //Ana Pencere
    htmlIndex = new BrowserWindow({
        //ipcRenderer ve ipcMain bilgi akışı için
        webPreferences: {
            nodeIntegration: true
        }
    });
    htmlIndex.loadURL(
        url.format({
            pathname: path.join(__dirname, "assets/html/index.html"),
            protocol: "file",
            slashes: true
        })
    );
    //Ana html'in kapanması durumu
    htmlIndex.on('close',()=>{
        app.quit();
    })
}
function fncHtmlLogin(){
    htmlLogin = new BrowserWindow({
        frame: false,
        height : 320,
        width : 400
    });
    htmlLogin.loadURL(
        url.format({
            pathname: path.join(__dirname, "assets/html/login.html"),
            protocol: "file",
            slashes: true
        })
    )
    htmlLogin.on('close', ()=>{
        htmlLogin = null;
    })
    //esnekllik
    htmlLogin.setResizable(false)
}
