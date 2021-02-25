const electron = require("electron");
const url = require("url");
const path = require("path");
const { app, BrowserWindow, Menu } = electron;

let htmlIndex;

app.on('ready', () => {
    //Ana Pencere
    htmlIndex = new BrowserWindow({});
    htmlIndex.loadURL(
        url.format({
            pathname: path.join(__dirname, "assets/html/index.html"),
            protocol: "file",
            slashes: true
        })
    );
    //Ana Menu Aktif Et
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);


});

//Ana menu Şablonu
const mainMenuTemplate = [
    {
        label : "NoteApp",
        submenu : [
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

