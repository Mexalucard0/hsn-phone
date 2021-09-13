fx_version 'adamant'
game 'gta5'
author 'HSN'
client_scripts {
    'client.lua',
    'nuicallbacks.lua',
    'config.lua',
}

server_scripts {
    "@mysql-async/lib/MySQL.lua",
    'server.lua',
    'config.lua',
    
}

ui_page "html/ui.html"
files {
    'html/ui.html',
    'html/script.js',
    'html/style.css',
    'html/reset.css',
    'html/images/*.png',
    'html/images/*.jpg',
    'html/*.ttf',
    'html/*.otf',
    'html/sounds/*'
}