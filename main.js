const electron = require("electron");
const url = require("url");
const path = require("path");
const { app, BrowserWindow, Menu, ipcMain} = electron;

let htmlIndex, htmlLogin, note;
let arrayNote = [];

//uygulama  hazır olduğunda
app.on('ready', () => {
    fncHtmlIndex();
    fncActiveMainMenu();

    //index.html den Note'u oku
    ipcMain.on("indexhtml->mainjs:writedNote", (err, data) => {
        if(data){
            note =  {
                id: arrayNote.length + 1,
                u_id: 334,
                note: data
            };
            arrayNote.push(note);
            //main'den index'e veri gonderimi
            htmlIndex.webContents.send("mainjs->indexhtml:note", note)
        }
        console.log(note)
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
