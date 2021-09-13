Config = Config or {}
Config.DB = "ghmattimysql" -- or "mysql-async"
Config.DownloadTimer = {
    ["Twitter"] = 15000, 
    ["Twitch"] = 3000,
    ["Advertisement"] = 4000,
    ["Cars"] = 5000,
    ["Finance"] = 6000
}

Config.TelfixCommand = "phonenuifix" -- or nil -- 

Config.CustomCryptoCurrencys = {
    ["ethereum"] = 0.00000,
    ["ggcoin"] = 0.00000,
    ["devcoin"] = 0.00000
}
Config.CryptoTransferCommission = {
    ["bitcoin"] = 5, -- 5%
    ["ethereum"] = 0.2, --0.2%
    ["ggcoin"] = 0.7, --0.7%
    ["devcoin"] = 1.4,--1.4%
}
Config.Voip = "pma-voice" -- or mumble or pma-voice
Config.Webhooks = {
    ["Camera"] = "https://discord.com/api/webhooks/854797484744245258/SLhwu2xKHnE9H9wk3ign3XZREUREJhXnSniFKL3FPqMguSvVvxZ4lPYcpGUffEvW0pfm",
    ["Twitter"] = "https://discord.com/api/webhooks/851717364915634176/K1Ck2q2gLibjF0C2KpT2Og3_QiM7ciMGUk_Ly1tCQS4sGaw_SeJZ1pqewlpZnyCfGm5v"
}
Config.PhoneBackgrounds = {
    "https://i.pinimg.com/474x/49/0d/cd/490dcd0a6072aeee34e49993b89c9a19.jpg",
    "http://cdn.shopify.com/s/files/1/0182/4159/files/02_05_IGStory_UniversalLove.jpg?format=jpg%20",
    "https://images.pexels.com/photos/1366919/pexels-photo-1366919.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500",
    "https://img.buzzfeed.com/buzzfeed-static/static/2018-04/13/12/asset/buzzfeed-prod-web-03/sub-buzz-8755-1523636113-1.jpg?output-quality=auto&output-format=auto&downsize=640:*",
    "https://wallpaper.csplague.com/wp-content/uploads/2020/02/New-painting-wallpaper-iphone-art-phone-backgrounds-ideas.jpg",
    "https://i.pinimg.com/236x/f0/40/f0/f040f07ac0ad09cc155ecc4bbface15a.jpg"
}
Config.Server = {
    Photo = "https://cdn.discordapp.com/attachments/672131642155859968/849632375092412446/Comp_1.gif",
    Name = "Null Roleplay"
}
Config.JobNames = {
    ["police"] = true, -- police and ambulance app 
    ["ambulance"] = true
}






