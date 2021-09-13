ESX = nil
HSN = {}
TwitterLikes = {}
download = {}
PhoneData = {}
TwitterAccounts = {}
PhoneCalls = {}
Notes = {}
CryptoCurrency = {}
AmbulancePatientDatas = {}
GalleryPhotos = {}
Bolos = {}
DownloadedApps  = {}
Walks = {}
Advertisements = {}
TriggerEvent("esx:getSharedObject",function(obj)
    ESX = obj
end)

exports["ghmattimysql"]:ready(function()
    local users = exports.ghmattimysql:executeSync('SELECT * FROM users', {})
    for k,v in pairs(users) do
        if PhoneData[v.identifier] == nil then
            PhoneData[v.identifier] = {}
            PhoneData[v.identifier].identifier = v.identifier
            PhoneData[v.identifier].phonenumber = v.phone_number ~= nil and v.phone_number or HSN.GeneratePhoneNumber(v.identifier)
            PhoneData[v.identifier].Apps = {}
            PhoneData[v.identifier].charinfo = {}
            PhoneData[v.identifier].messages = {}
            PhoneData[v.identifier].charinfo.firstname = v.firstname ~= nil and v.firstname or "Unknown"
            PhoneData[v.identifier].charinfo.lastname = v.lastname ~= nil and v.lastname or "Unknown"
            PhoneData[v.identifier].charinfo.cryptoid = v.cryptoid ~= nil and v.cryptoid or HSN.GenerateCryptoId(v.identifier)
            PhoneData[v.identifier].charinfo.iban = v.iban ~= nil and v.iban or HSN.GenerateIban(v.identifier)
            PhoneData[v.identifier].CryptoCurrency = v.cryptocurrency ~= nil and json.decode(v.cryptocurrency) or {}

            if v.phonedata ~= nil then
                local phoneData = json.decode(v.phonedata)
                for i,j in pairs(phoneData) do
                    if i ~= "firstname" and i ~= "lastname" and i ~= "bankbalance" then
                        PhoneData[v.identifier].charinfo[i] = j
                    end
                end
            end
        end
        if v.bolos ~= nil then
            v.bolos = json.decode(v.bolos)
            for i,n in pairs(v.bolos) do
                if Bolos[v.identifier] == nil then
                    Bolos[v.identifier] = {}
                end
                table.insert(Bolos[v.identifier], n)
            end
        end
        if v.downloadedapps ~= nil then
            v.downloadedapps = json.decode(v.downloadedapps)
            for o,s in ipairs(v.downloadedapps) do
                table.insert(PhoneData[v.identifier].Apps, s)
            end
        end
    end
    for k,v in pairs(users) do
        PhoneData[v.identifier].contacts = {}
        if v.contacts ~= nil then
            v.contacts = json.decode(v.contacts)
            for o,s in pairs(v.contacts) do
                if HSN.GetPlayerFromPhoneNumber(s.phonenumber) == "" then
                    s.photo = s.photo
                else
                    s.photo = HSN.GetPlayerFromPhoneNumber(s.phonenumber).charinfo.photo
                end
                table.insert(PhoneData[v.identifier].contacts,s)
            end
        end
    end
    for k,v in pairs(users) do
        if PhoneData[v.identifier].cryptocurrencytransfers == nil then
            PhoneData[v.identifier].cryptocurrencytransfers  = {} 
        end
        if v.cryptocurrencytransfers ~= nil then
            v.cryptocurrencytransfers = json.decode(v.cryptocurrencytransfers)
            for i,j in ipairs(v.cryptocurrencytransfers) do

                table.insert(PhoneData[v.identifier].cryptocurrencytransfers, j)
            end
        end
    end
    
    local mails = exports.ghmattimysql:executeSync('SELECT * FROM hsn_phone_mails', {})
    for k,v in ipairs(mails) do
        if PhoneData[v.owner].mails == nil then
            PhoneData[v.owner].mails = {}
        end
        table.insert(PhoneData[v.owner].mails,v)
    end
    Citizen.Wait(10)
    local notes = exports.ghmattimysql:executeSync('SELECT * FROM hsn_phone_notes', {})
    for k,v in ipairs(notes) do
        if PhoneData[v.owner].notes == nil then
            PhoneData[v.owner].notes = {}
        end
        local noteData = json.decode(v.noteData)
        noteData.id = v.id
        table.insert(PhoneData[v.owner].notes,noteData)
    end
    local accounts = exports.ghmattimysql:executeSync('SELECT * FROM hsn_phone_twitter_accounts', {})
    for k,v in pairs(accounts) do
        TwitterAccounts[v.username] = {}
        TwitterAccounts[v.username].owner = v.owner
        TwitterAccounts[v.username].password = v.password
        TwitterAccounts[v.username].photo = v.photo
        TwitterAccounts[v.username].username = v.username
    end
    local cryptocurrencyfile = json.decode(LoadResourceFile("hsn-phone", "./cryptocurrency.json")) 
    if cryptocurrencyfile then
        for k,v in pairs(cryptocurrencyfile) do
            CryptoCurrency[k] = v
        end
    else
        local saved = SaveResourceFile("hsn-phone", "./cryptocurrency.json", json.encode(Config.CustomCryptoCurrencys), -1)
        if saved then
            print("^2hsn-phone | Saved cryptocurrencts to json.")
        else
            print("^1hsn-phone | Unknown error for save cryptocurrencts. \n  Change the script name to ^6hsn-phone!")
        end
    end

    local PatientDatas = exports.ghmattimysql:executeSync('SELECT * FROM hsn_phone_ambulancepatients', {})
    if PatientDatas[1] then
        for k,v in ipairs(PatientDatas) do
            table.insert(AmbulancePatientDatas, v)
        end
    end

    local gallery = json.decode(LoadResourceFile("hsn-phone", "./galleryphotos.json")) 
    if gallery then
        for k,v in pairs(gallery) do
            if GalleryPhotos[k] == nil then
                GalleryPhotos[k] = {}
            end
            for m,n in pairs(v) do
                table.insert(GalleryPhotos[k], n)
            end
        end
    end
    for o,p in pairs(PhoneData) do
        local messages = exports.ghmattimysql:executeSync("SELECT owner, number, data, DATE as DATE FROM hsn_phone_messages WHERE `owner` = '"..o.."' ORDER BY DATE DESC") 
        if messages[1] then
            
            for k,v in pairs(messages) do
                if PhoneData[v.owner].messages == nil then
                    PhoneData[v.owner].messages = {}
                end
                print(v.owner)
                print(153)
                v.data = json.decode(v.data)
                    if PhoneData[v.owner].messages[v.number] == nil then
                        PhoneData[v.owner].messages[v.number] = {}
                    end
                    PhoneData[v.owner].messages[v.number].lastmessage = v.data.lastmessage
                    PhoneData[v.owner].messages[v.number].lastmessagetime  = v.data.lastmessagetime
                    local Player = HSN.GetPlayerFromPhoneNumber(v.number)
                    PhoneData[v.owner].messages[v.number].playerphoto  = Player ~= "" and Player.charinfo.photo or "default"
                    PhoneData[v.owner].messages[v.number].name = FormatGetContact(v.owner, v.number)
                    print(163)
                    for m,n in ipairs(v.data.localmessages) do

                        if PhoneData[v.owner].messages[v.number].localmessages == nil then
                            PhoneData[v.owner].messages[v.number].localmessages = {}
                        end
                        table.insert(PhoneData[v.owner].messages[v.number].localmessages, n)
                    end
                --end
            end
    
        end
    end
end)



ESX.RegisterServerCallback("hsn-phone-server-getmessagedata",function(source,cb)
    local Player = ESX.GetPlayerFromId(source)
    local returnData = {}
    local messages = exports.ghmattimysql:executeSync("SELECT owner, number, data, DATE as DATE FROM hsn_phone_messages WHERE `owner` = '"..Player.identifier.."' ORDER BY DATE DESC") 
        if messages[1] then
            for k,v in pairs(messages) do
                local PlayerT = HSN.GetPlayerFromPhoneNumber(v.number)
                v.data = json.decode(v.data)
                table.insert(returnData, {number = v.number, lastmessage = v.data.lastmessage, lastmessagetime =v.data.lastmessagetime,playerphoto = PlayerT ~= "" and PlayerT.charinfo.photo or "default",name = FormatGetContact(v.owner, v.number), localmessages =  v.data.localmessages })
            end
        end
        cb(returnData)
end)


HSN.GetPlayerData = function(identifier)
    if PhoneData[identifier] == nil then
        local fullname = HSN.GetPlayerCharacterName(identifier)
        PhoneData[identifier] = {}
        PhoneData[identifier].phonenumber = HSN.GeneratePhoneNumber(identifier)
        PhoneData[identifier].charinfo = {}
        PhoneData[identifier].charinfo.firstname = fullname.firstname
        PhoneData[identifier].charinfo.lastname = fullname.lastname
        PhoneData[identifier].charinfo.cryptoid = HSN.GenerateCryptoId(identifier)
        PhoneData[identifier].charinfo.iban = HSN.GenerateIban(identifier)
        PhoneData[identifier].charinfo.photo = "default"
        PhoneData[identifier].contacts = {}
        PhoneData[identifier].mails = {}
        PhoneData[identifier].notes = {}
        PhoneData[identifier].identifier = identifier
        PhoneData[identifier].Apps = {}
        PhoneData[identifier].messages = {}
        PhoneData[identifier].CryptoCurrency = {}
        exports.ghmattimysql:execute('UPDATE users SET phonedata = @phonedata WHERE identifier = @identifier', {
            ['@phonedata'] = json.encode(PhoneData[identifier].charinfo),
            ['@identifier'] = identifier
        })   
        return {loaded = true, isNew = true}
    else
        return {loaded = true, isNew = false}
    end
end


-- ESX.RegisterServerCallback("hsn-phone-server-getPlayerFromPhoneNumber",function(source,cb,number)
--     local Ply = ESX.GetPlayerFromId(source)
--     local name = nil
--     local tPlayer = HSN.GetPlayerFromPhoneNumber(number)
--     if tPlayer == "" then
--         TPlayer2 = {}
--         TPlayer2.charinfo = {}
--         TPlayer2.charinfo.photo = "https://cdn.discordapp.com/attachments/826784608376455178/834637030255755276/default.png"
--         tPlayer = TPlayer2
--     end
--     for k,v in pairs(PhoneData[Ply.identifier].contacts) do
--         if tonumber(v.contact.phonenumber) == tonumber(number) then
--             name = v.contact.name
--             break
--         end
--     end
--     cb({Player = tPlayer, name = name})
-- end)

RegisterNetEvent("server-print")
AddEventHandler("server-print",function(param)
    TriggerClientEvent("test",source,param)
end)

HSN.GetPlayerFromIban = function(iban) 
    local returnData 
    
    if iban == nil then return nil end
    for k,v in pairs(PhoneData) do
        if v.charinfo.iban ~= nil and v.charinfo.iban == iban then
            returnData = PhoneData[k]
            break
        end
    end
    return returnData
end
HSN.GetPlayerFromCryptoId = function(cryptoid)
    if cryptoid ~= nil then
        for k,v in pairs(PhoneData) do
            if (v.charinfo.cryptoid  and v.charinfo.cryptoid == cryptoid) then
                return k
            end
        end
    end
    return nil
end

HSN.GenerateCallId = function()
    local callid = math.random(1,9999)
    while PhoneCalls[callid] ~= nil do
        local callid = math.random(1,9999)
    end
    return callid
end

HSN.GenerateLocalId = function()
    local id = math.random(1,9999)
    for k,v in pairs(GalleryPhotos) do
        for i,j in pairs(v) do
            if j.id ~= nil then
                while j.id == id do
                    id = math.random(1,9999)
                end
            end
        end
    end

    return id
end

HSN.GenerateIban = function(identifier)
    local iban = math.random(1,9999)
    exports.ghmattimysql:execute('UPDATE users SET iban = @iban WHERE identifier = @identifier', {
        ['@iban'] = iban,
        ['@identifier'] = identifier
    }) 
    return iban
end

HSN.GetPlayerCharinfoPhoto = function(src)
    local Player = ESX.GetPlayerFromId(src)
    if PhoneData[Player.identifier] == nil then
        PhoneData[Player.identifier] = {}
    end
    if PhoneData[Player.identifier].charinfo == nil then
        PhoneData[Player.identifier].charinfo = {}
    end
    if PhoneData[Player.identifier].charinfo.photo == nil then
        PhoneData[Player.identifier].charinfo.photo = ""
    end
    return PhoneData[Player.identifier].charinfo.photo
end


HSN.GetPlayerFromPhoneNumber = function(phonenumber)
    local returnData = ""
    if phonenumber == nil then print("phone number is nil ") return "" end
    for k,v in pairs(PhoneData) do
        if tonumber(v.phonenumber) == tonumber(phonenumber) then
            returnData = PhoneData[k]
            break
        end
    end
    return returnData
end


HSN.GetTwitterPhotoFromUsername = function(username)
    if username == nil then
        return
    end
    if TwitterAccounts[username] ~= nil then
        return TwitterAccounts[username].photo
    else
        return nil
    end
end





AddEventHandler("esx:playerLoaded",function(playerId,ply)
    local plyData = HSN.GetPlayerData(ply.identifier)
    if (plyData and plyData.loaded) then
        if plyData.isNew then print('[^2hsn-phone^0] - Player information has been loaded! '..ply.identifier) end
    end
end)



HSN.GeneratePhoneNumber = function(identifier) 
    local generated = math.random(100000,850000)
    exports.ghmattimysql:execute('UPDATE users SET phone_number = @phone_number WHERE identifier = @identifier', {
        ['@phone_number'] = generated,
        ['@identifier'] = identifier
    }) 
    return generated
end

HSN.GenerateCryptoId = function(identifier)
    local generated = 'cpt-'..HSN.RandomStr(2)..""..HSN.RandomInt(3)
    exports.ghmattimysql:execute('UPDATE users SET cryptoid = @cryptoid WHERE identifier = @identifier', {
        ['@cryptoid'] = generated,
        ['@identifier'] = identifier
    }) 
    return generated
end 


ESX.RegisterServerCallback("hsn-phone-server-getcharinfo",function(source,cb)
    local Player = ESX.GetPlayerFromId(source)
    if PhoneData[Player.identifier] == nil then
        PhoneData[Player.identifier] = {}
    end
    PhoneData[Player.identifier].charinfo.bankbalance = Player.getAccount("bank").money
    PhoneData[Player.identifier].job = Player.job.grade_label
    PhoneData[Player.identifier].twitterData = HSN.GetPlayerTwitterAccount(source)
    cb(PhoneData[Player.identifier])
end)


RegisterServerEvent("hsn-phone-server-changePhoto")
AddEventHandler("hsn-phone-server-changePhoto",function(index, photo)
    local Player = ESX.GetPlayerFromId(source)
    if index ~= nil then
        if index == "charinfo" then
            if PhoneData[Player.identifier] == nil then
                PhoneData[Player.identifier] = {}
            end
            if PhoneData[Player.identifier].charinfo == nil then
                PhoneData[Player.identifier].charinfo = {}
            end
            if PhoneData[Player.identifier].charinfo.photo == nil then
                PhoneData[Player.identifier].charinfo.photo = ""
            end
            PhoneData[Player.identifier].charinfo.photo = photo
            exports.ghmattimysql:execute('UPDATE users SET phonedata = @phonedata WHERE identifier = @identifier', {
                ['@phonedata'] = json.encode(PhoneData[Player.identifier].charinfo),
                ['@identifier'] = Player.identifier
            }) 
        elseif index == "twitter" then
            local Username = HSN.GetPlayerTwitterUsername(source)
            if TwitterAccounts[Username] ~= nil then
                if TwitterAccounts[Username].photo == nil then
                    TwitterAccounts[Username].photo = ""
                end
                TwitterAccounts[Username].photo = photo
            end
            exports.ghmattimysql:execute('UPDATE hsn_phone_twitter_accounts SET photo = @photo WHERE username = @username', {
                ['@photo'] = photo,
                ['@username'] = Username
            })
        elseif index == "phone-background" then
            if PhoneData[Player.identifier] == nil then
                PhoneData[Player.identifier] = {}
            end
            if PhoneData[Player.identifier].charinfo.phonebackground == nil then
                PhoneData[Player.identifier].charinfo.phonebackground = ""
            end
            PhoneData[Player.identifier].charinfo.phonebackground = photo
        end
        exports.ghmattimysql:execute('UPDATE users SET phonedata = @phonedata WHERE identifier = @identifier', {
            ['@phonedata'] = json.encode(PhoneData[Player.identifier].charinfo),
            ['@identifier'] = Player.identifier
        }) 
        TriggerClientEvent("hsn-phone-client-setPhoto",source,index, photo)
        local message = 'Photo changed!'
        TriggerClientEvent("hsn-phone-client:NewNotification",source,{type = "message",message = message, icon = '<i class="fas fa-image"></i>', background = "#1d3557", app = "Settings", duration = 4000})
    end
end)





--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--                                       APP STORE





RegisterServerEvent("hsn-phone-server-downloadApp")
AddEventHandler("hsn-phone-server-downloadApp",function(app)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    if download[Player.identifier] == nil then
        download[Player.identifier] = {}
    end
    if download[Player.identifier][app] == nil then
        download[Player.identifier][app] = Config.DownloadTimer[app]
        HSN.SetDownloadedAppTime(src, Player.identifier,app)
    end
end)

RegisterServerEvent("hsn-phone-server-deleteApp")
AddEventHandler("hsn-phone-server-deleteApp",function(app)
    local src = source
    local Ply = ESX.GetPlayerFromId(src)
    Citizen.Wait(10)
    if download[Ply.identifier] ~= nil and download[Ply.identifier][app] ~= nil then
        download[Ply.identifier][app] = nil
    end
    for k,v in pairs(PhoneData[Ply.identifier].Apps) do
        if v == app then
            TriggerClientEvent("hsn-phone-client-deleteApp",src,app)
            local message = 'Application deleted!'
            TriggerClientEvent("hsn-phone-client:NewNotification",src,{type = "message",message = message, icon = '<i class="fab fa-app-store"></i>', background = "rgb(12, 163, 218)", app = "App Store", duration = 4000})
            table.remove(PhoneData[Ply.identifier].Apps, k)
            exports.ghmattimysql:execute('UPDATE users SET downloadedapps = @downloadedapps WHERE identifier = @identifier', {
                ['@downloadedapps'] = json.encode(PhoneData[Ply.identifier].Apps),
                ['@identifier'] = Ply.identifier
            }) 
            break
        end
    end
end)


HSN.SetDownloadedAppTime = function(source,identifier, app)
    Citizen.CreateThread(function()
        while download[identifier][app] > 1 do
            Citizen.Wait(1000)
            download[identifier][app] = download[identifier][app] - 1000
            if download[identifier][app] <= 0 then
                    TriggerClientEvent("hsn-phone-server-setupnewApp",source,app)
                    local message = 'Application installed!'
                    TriggerClientEvent("hsn-phone-client:NewNotification",source,{type = "message",message = message, icon = '<i class="fab fa-app-store"></i>', background = "rgb(12, 163, 218)", app = "App Store", duration = 4000})
                    Citizen.Wait(10)
                    if PhoneData[identifier].Apps == nil then
                        PhoneData[identifier].Apps = {}
                    end
                    table.insert(PhoneData[identifier].Apps, app)
                    exports.ghmattimysql:execute('UPDATE users SET downloadedapps = @downloadedapps WHERE identifier = @identifier', {
                        ['@downloadedapps'] = json.encode(PhoneData[identifier].Apps),
                        ['@identifier'] = identifier
                    }) 
                break
            end
        end
    end)
end



--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--                                       Last Calls




RegisterServerEvent("hsn-phone-server-deletelastcall")
AddEventHandler("hsn-phone-server-deletelastcall",function(id)
    id = tonumber(id)
    local src = source
    local Ply = ESX.GetPlayerFromId(src)
    if PhoneData[Ply.identifier] == nil then
        PhoneData[Ply.identifier] = {}
    end
    if PhoneData[Ply.identifier].lastcalls == nil then
        PhoneData[Ply.identifier].lastcalls = {}
    end
    PhoneData[Ply.identifier].lastcalls[id] = nil
end)







HSN.GetLastCalls = function(src)
     
    local Ply = ESX.GetPlayerFromId(src)
    if PhoneData[Ply.identifier] == nil then
        PhoneData[Ply.identifier] = {}
    end
    if PhoneData[Ply.identifier].lastcalls == nil then
        PhoneData[Ply.identifier].lastcalls = {}
    end
    return PhoneData[Ply.identifier].lastcalls
end


ESX.RegisterServerCallback("hsn-phone-server-getLastCalls",function(source,cb)
    local Ply = ESX.GetPlayerFromId(source)
    if PhoneData[Ply.identifier] == nil then
        PhoneData[Ply.identifier] = {}
    end
    if PhoneData[Ply.identifier].lastcalls == nil then
        PhoneData[Ply.identifier].lastcalls = {}
    end
    cb(PhoneData[Ply.identifier].lastcalls) 
end)


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--                                       Twitter


RegisterCommand("twitter",function(source)
    TwitterAccounts['1'] = {}
    TwitterAccounts['1'].password = "hsn"
end)



ESX.RegisterServerCallback("hsn-phone-server-IsUserNameTaken",function(source,cb,username)
    if TwitterAccounts[username] == nil then
        cb(false)
        return
    end
    cb(true)
end)

ESX.RegisterServerCallback("hsn-phone-server-TwitterAccountCheck",function(source,cb,data)
    local Player = ESX.GetPlayerFromId(source)
    if TwitterAccounts[data.username] == nil then
        cb({data = false, reason = "The username is unknown"})
    else
        if TwitterAccounts[data.username].password == nil then
            return cb({data = false, reason = ""})
        end
        if TwitterAccounts[data.username].password == data.password then
            cb({data = true, reason = "", photo = TwitterAccounts[data.username].photo})
            TwitterAccounts[data.username].owner = Player.identifier
            exports.ghmattimysql:execute('UPDATE hsn_phone_twitter_accounts SET owner = @owner WHERE username = @username', {
                ['@owner'] =Player.identifier,
                ['@username'] = data.username,
            })
        else
            cb({data = false, reason = "Wrong password"})
        end
    end
end)






RegisterServerEvent("hsn-phone-server-registerTwitter-confirm")
AddEventHandler("hsn-phone-server-registerTwitter-confirm",function(data)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
	exports.ghmattimysql:executeSync('INSERT INTO hsn_phone_twitter_accounts (username, password, owner, photo) VALUES (@username, @password, @owner, @photo)', {
		['@username'] = data.username,
		['@password'] = data.password,
		['@owner'] = Player.identifier,
        ["@photo"] = "default"
	})
    TwitterAccounts[data.username] = {}
    TwitterAccounts[data.username].password = data.password
    TwitterAccounts[data.username].username = data.username
    TwitterAccounts[data.username].owner    = Player.identifier
    TwitterAccounts[data.username].photo    = "default"
    TriggerClientEvent("hsn-phone-client-updateTwitterData",src, TwitterAccounts[data.username])
end)

RegisterServerEvent("hsn-phone-server-SendNewTweet")
AddEventHandler("hsn-phone-server-SendNewTweet",function(data)
    if type(data) == "table" then
        local Player = ESX.GetPlayerFromId(source)
        local twtAcc = HSN.GetPlayerTwitterAccount(source)
        if twtAcc ~= nil then
            if PhoneData[Player.identifier] ~= nil and PhoneData[Player.identifier].charinfo ~= nil then
                data.flastname = PhoneData[Player.identifier].charinfo.firstname..' '..PhoneData[Player.identifier].charinfo.lastname
            else
                data.flastname = "Unknown"
            end
            exports.ghmattimysql:execute('INSERT INTO hsn_phone_tweets (username, message, photo, flastname, date) VALUES (@username, @message, @photo, @flastname, @date)', {
                ['@username']   = twtAcc.username,
                ['@message']   = data.message,
                ['@photo'] = data.photo,
                ['@flastname'] = data.flastname,
                ['@date'] = data.date
            }, function(result)
                data.username = twtAcc.username
                data.user_photo = twtAcc.photo
                data.id = result.insertId
                TriggerClientEvent("hsn-phone-client-SendNewTweet",-1,data)   
                local message = twtAcc.username.." tweeted!"
                TriggerClientEvent("hsn-phone-client:NewNotification",-1,{type = "message",message = message, icon = '<i class="fab fa-twitter"></i>', background = "#00a8ff", app = "Twitter", duration = 3000})
                TwitterLikes[data.id] = {}
                TwitterLikes[data.id].togglelikes = {}
                HSN.SendLog("Twitter", Config.Webhooks["Twitter"], data.message, data.photo, data.user_photo)
            end)
        end
    end
end)

RegisterServerEvent("hsn-phone-server-togglelike")
AddEventHandler("hsn-phone-server-togglelike",function(tweetId)
    tweetId = tonumber(tweetId)
    local Player = ESX.GetPlayerFromId(source)
    local PlayerData = {}
    local ReturnData = {}
    local result = exports.ghmattimysql:executeSync('SELECT * FROM hsn_phone_tweets WHERE id = @id', {
		['@id']  = tweetId
	})
    if TwitterLikes[tweetId] ~= nil then
        if TwitterLikes[tweetId].togglelikes ~= nil then
            if TwitterLikes[tweetId].togglelikes[Player.identifier] ~= nil then
                TwitterLikes[tweetId].togglelikes[Player.identifier] = nil
                result[1].likes = result[1].likes + -1
            else
                result[1].likes = result[1].likes + 1
                TwitterLikes[tweetId].togglelikes[Player.identifier] = true
            end
        else
            result[1].likes = result[1].likes + 1
            TwitterLikes[tweetId].togglelikes = {}
            TwitterLikes[tweetId].togglelikes[Player.identifier] = true
        end
        exports.ghmattimysql:execute('UPDATE hsn_phone_tweets SET togglelikes = @togglelikes , likes = @likes WHERE id = @id', {
            ['@togglelikes'] = json.encode(TwitterLikes[tweetId].togglelikes),
            ['@id'] = tweetId,
            ['@likes'] = result[1].likes
        }, function(rowsChanged)
            TriggerClientEvent("hsn-phone-client-refresh-twitterlikes",-1,tweetId, result[1].likes)
        end)
    end
end)


RegisterServerEvent("hsn-phone-server-twitter-DeleteTwitterAccount")
AddEventHandler("hsn-phone-server-twitter-DeleteTwitterAccount",function()
    local UserName = HSN.GetPlayerTwitterUsername(source)
    if UserName ~= nil then
        exports.ghmattimysql:execute('DELETE FROM hsn_phone_twitter_accounts WHERE username = @username', {
            ['@username'] = UserName,
        })
        if TwitterAccounts[UserName] ~= nil then
            TwitterAccounts[UserName] = nil
        end
    end
end)




RegisterServerEvent("hsn-phone-server-twitter-logOut")
AddEventHandler("hsn-phone-server-twitter-logOut",function()
    local UserName = HSN.GetPlayerTwitterUsername(source)
    if UserName ~= nil then
        exports.ghmattimysql:execute('UPDATE `hsn_phone_twitter_accounts` SET `owner`= "" WHERE username = @username', {
            ['@username'] = UserName
        }, function()
            TwitterAccounts[UserName].owner = ""
        end)
    end
end)




HSN.GetPlayerTwitterUsername = function(src)
    local foundAccount = nil
    local Ply = ESX.GetPlayerFromId(src)
    for k,v in pairs(TwitterAccounts) do
        if (TwitterAccounts[v.username].owner ~= nil) and (TwitterAccounts[v.username].owner == Ply.identifier) then
            foundAccount = v.username
            break
        end
    end
    return foundAccount
end

HSN.GetPlayerTwitterAccount = function(src)
    local foundAccount = {}
    local Ply = ESX.GetPlayerFromId(src)
    for k,v in pairs(TwitterAccounts) do
        if (TwitterAccounts[v.username].owner ~= nil) and (TwitterAccounts[v.username].owner == Ply.identifier) then
            foundAccount = {}
            foundAccount.username = v.username
            foundAccount.password = v.password
            foundAccount.photo = v.photo
            break
        end
    end
    return foundAccount
end

ESX.RegisterServerCallback("hsn-phone-server-getTweets",function(source,cb)
    local returnData = {}
    local tweets = exports.ghmattimysql:executeSync('SELECT * FROM hsn_phone_tweets', {})
    for k,v in ipairs(tweets) do
        if TwitterLikes[v.id] == nil then
            TwitterLikes[v.id] = {}
            TwitterLikes[v.id].togglelikes = json.decode(v.togglelikes)
        end
        table.insert(returnData,{username = v.username, message = v.message, photo = v.photo, id = v.id, likes = tonumber(v.likes), togglelikes = json.decode(v.togglelikes), user_photo = HSN.GetTwitterPhotoFromUsername(v.username),  flastname = v.flastname, date = v.date  })
    end
    cb(returnData)
end)




--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--                                       Notifications


RegisterServerEvent("hsn-phone-server-sendnewNotification")
AddEventHandler("hsn-phone-server-sendnewNotification",function(data)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    if PhoneData[Player.identifier] == nil then
        PhoneData[Player.identifier] = {}
    end
end)








ESX.RegisterServerCallback("hsn-phone-server-GetPlayerNotifications",function(source,cb)
    cb(HSN.GetNotifications(source))
end)




-- functions

HSN.AddNotificaton = function(src,message) 
    local Ply = ESX.GetPlayerFromId(src)
    if PhoneData[Ply.identifier] == nil then
        PhoneData[Ply.identifier] = {}
    end
    if PhoneData[Ply.identifier].notifications == nil then
        PhoneData[Ply.identifier].notifications = {}
    end
    exports.ghmattimysql:execute('INSERT INTO test (message, identifier) VALUES (@message, @identifier)', {
        ['@message']   = message,
        ['@identifier']   = Ply.identifier,
    }, function(result)
        PhoneData[Ply.identifier].notifications[result] = {}
        PhoneData[Ply.identifier].notifications[result].message = message
        PhoneData[Ply.identifier].notifications[result].notificationid = result
        PhoneData[Ply.identifier].notifications[result].owner = Ply.identifier
    end)
end

HSN.GetNotifications = function(src)

    local Ply = ESX.GetPlayerFromId(src)
    if PhoneData[Ply.identifier] == nil then
        PhoneData[Ply.identifier] = {}
    end
    if PhoneData[Ply.identifier].notifications == nil then
        PhoneData[Ply.identifier].notifications = {}
    end
    return PhoneData[Ply.identifier].notifications
end


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--                                       Notes
RegisterServerEvent("hsn-phone-server-addNewNote")
AddEventHandler("hsn-phone-server-addNewNote",function(data)
    local src = source
    local Ply = ESX.GetPlayerFromId(src)
    if PhoneData[Ply.identifier] == nil then
        PhoneData[Ply.identifier] = {}
    end
    if PhoneData[Ply.identifier].notes == nil then
        PhoneData[Ply.identifier].notes = {}
    end
    if (type(data) ~= "table") then
        return
    end
    local InsertData = {}
    InsertData.message = data.text
    InsertData.title = data.title
    InsertData.photo = data.photo
    InsertData.date = data.date
    HSN.AddNewNote(src,InsertData)
end)


ESX.RegisterServerCallback("hsn-phone-server-getNotes",function(source,cb)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    if PhoneData[Player.identifier].notes == nil then
        PhoneData[Player.identifier].notes = {}
    end
    cb(PhoneData[Player.identifier].notes)
end)

ESX.RegisterServerCallback("hsn-phone-server-getNote",function(source,cb,noteid)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    local data = {}
    if PhoneData[Player.identifier].notes == nil then
        PhoneData[Player.identifier].notes = {}
    end
    for k,v in pairs(PhoneData[Player.identifier].notes) do
        if v.noteData.id == tonumber(noteid) then
            data = v.noteData
            break
        end
    end
    cb(data)
end)

RegisterServerEvent("hsn-phone-server-deletenote")
AddEventHandler("hsn-phone-server-deletenote",function(noteid)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    if PhoneData[Player.identifier].notes == nil then
        PhoneData[Player.identifier].notes = {}
    end
    for k,v in pairs(PhoneData[Player.identifier].notes) do
        if v.id == tonumber(noteid) then
            table.remove(PhoneData[Player.identifier].notes,k)
            TriggerClientEvent("hsn-phone-client-deleteNote",src,noteid)
            exports.ghmattimysql:execute('DELETE FROM hsn_phone_notes WHERE id = @id', {
                ['@id'] = tonumber(noteid)
            })
            break
        end
    end
end)





HSN.AddNewNote = function(src,noteData)
    local Player = ESX.GetPlayerFromId(src)
    exports.ghmattimysql:execute('INSERT INTO hsn_phone_notes (owner, noteData) VALUES (@owner, @noteData)', {
        ['@owner']   = Player.identifier,
        ['@noteData']   = json.encode(noteData),
    }, function(result)
        noteData.id = result.insertId
        table.insert(PhoneData[Player.identifier].notes,noteData)
        TriggerClientEvent("hsn-phone-client-addNewNote",src,noteData)
    end)
end


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--                                      Contacts


ESX.RegisterServerCallback("hsn-phone-server-getContacts",function(source,cb)
    local src = source
    local Ply = ESX.GetPlayerFromId(src)
    if PhoneData[Ply.identifier].contacts == nil then
        PhoneData[Ply.identifier].contacts = {}
    end
    if #PhoneData[Ply.identifier].contacts == 0 then
        cb("0")
    else
        cb(PhoneData[Ply.identifier].contacts)
    end
end)

FormatGetContact = function(identifier, number)
    local Name = number
    if PhoneData[identifier].contacts then
        for k,v in pairs(PhoneData[identifier].contacts) do
            if tonumber(v.phonenumber) == tonumber(number) then
                Name =  v.name
            end
        end
    end
    return Name
end

NumberInContact = function(identifier, number)
    if PhoneData[identifier].contacts then
        for k,v in pairs(PhoneData[identifier].contacts) do
            if tonumber(v.phonenumber) == tonumber(number) then
                return true
            end
        end
    end
    return fncvalues
end

RegisterServerEvent("hsn-phone-server-addnewContact")
AddEventHandler("hsn-phone-server-addnewContact",function(data)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    local TargetPlayer = HSN.GetPlayerFromPhoneNumber(data.phonenumber)
    if data.phonenumber and data.name then
        if PhoneData[Player.identifier].contacts == nil then
            PhoneData[Player.identifier].contacts = {}
        end
        if TargetPlayer ~= "" then
            if TargetPlayer.charinfo.photo == nil then
                data.photo = "default"
            else
                data.photo = TargetPlayer.charinfo.photo
            end
            table.insert(PhoneData[Player.identifier].contacts,data)
            data.id = math.random(8000,100000)
            exports.ghmattimysql:execute('UPDATE users SET contacts = @contacts WHERE identifier = @identifier', {
                ['@contacts'] = json.encode(PhoneData[Player.identifier].contacts),
                ['@identifier'] = Player.identifier
            })
            TriggerClientEvent("hsn-phone-client-addnewcontact",src,data)
        else
            data.id = math.random(8000,100000)
            data.photo = "default"
            table.insert(PhoneData[Player.identifier].contacts, data)
            exports.ghmattimysql:execute('UPDATE users SET contacts = @contacts WHERE identifier = @identifier', {
                ['@contacts'] = json.encode(PhoneData[Player.identifier].contacts),
                ['@identifier'] = Player.identifier
            })
            TriggerClientEvent("hsn-phone-client-addnewcontact",src,data)
        end
    end
end)

RegisterServerEvent("hsn-phone-server-DeleteContact")
AddEventHandler("hsn-phone-server-DeleteContact",function(contactid)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    if contactid == nil then
        return
    end
    contactid = tonumber(contactid)
    for k,v in pairs(PhoneData[Player.identifier].contacts) do
        if tonumber(v.id) == contactid then
            table.remove(PhoneData[Player.identifier].contacts,k)
            exports.ghmattimysql:execute('UPDATE users SET contacts = @contacts WHERE identifier = @identifier', {
                ['@contacts'] = json.encode(PhoneData[Player.identifier].contacts),
                ['@identifier'] = Player.identifier
            })
            TriggerClientEvent("hsn-phone-client:RemoveContact",src, contactid)
            break
        end
    end
end)


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--   Gallery

RegisterServerEvent("hsn-phone-server-addPhotoToGallery")
AddEventHandler("hsn-phone-server-addPhotoToGallery",function(photo)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    if GalleryPhotos[Player.identifier] == nil then
        GalleryPhotos[Player.identifier] = {}
    end
    local data = {}
    data.photo = photo
    data.id = HSN.GenerateLocalId()
    table.insert(GalleryPhotos[Player.identifier], data)
    SaveResourceFile("hsn-phone", "./galleryphotos.json", json.encode(GalleryPhotos), -1)
    TriggerClientEvent("hsn-phone-client-addNewPhotoToGallery",src,photo, data.id)
end)

RegisterServerEvent("hsn-phone-server-DeletePhotoFromGallery")
AddEventHandler("hsn-phone-server-DeletePhotoFromGallery",function(id)
    local Player = ESX.GetPlayerFromId(source)
    if id ~= nil then
        if GalleryPhotos[Player.identifier] ~= nil then
            for k,v in pairs(GalleryPhotos[Player.identifier]) do
                if v.id == tonumber(id) then
                    table.remove(GalleryPhotos[Player.identifier], k)
                    SaveResourceFile("hsn-phone", "./galleryphotos.json", json.encode(GalleryPhotos), -1)
                    TriggerClientEvent("hsn-phone-client-DeletePhotoFromGallery",source, id)
                    break
                end
            end
        end
    end
end)



ESX.RegisterServerCallback("hsn-phone-server-getGalleryPhotos",function(source,cb)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    if GalleryPhotos[Player.identifier] == nil then
        GalleryPhotos[Player.identifier] = {}
    end
    cb(GalleryPhotos[Player.identifier])
end)


--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--   Bank

RegisterServerEvent("hsn-phone-server-sendMoney")
AddEventHandler("hsn-phone-server-sendMoney",function(data)
    local Player = ESX.GetPlayerFromId(source)
    local returnData = {}
    if (data.iban and data.amount) then
        local TargetPlayer = HSN.GetPlayerFromIban(data.iban)
        if (TargetPlayer == nil) then
            local message = "The IBAN unknown!"
                TriggerClientEvent("hsn-phone-client:NewNotification",source,{type = "message",message = message, icon = '<i class="fas fa-university"></i>', background = "rgb(177, 52, 59)", app = "Bank", duration = 3000})
            return
        end
        if (ESX.GetPlayerFromIdentifier(TargetPlayer.identifier)) then
            if TargetPlayer.identifier == Player.identifier then
               --TriggerClientEvent("hsn-phone-client-sendMoney",source,returnData)
                local message = "Can't send money to yourself!"
                TriggerClientEvent("hsn-phone-client:NewNotification",source,{type = "message",message = message, icon = '<i class="fas fa-university"></i>', background = "rgb(177, 52, 59)", app = "Bank", duration = 3000})
            else
                if (Player.getAccount("bank").money >= tonumber(data.amount)) then
                    local trgtSrcPlayer = ESX.GetPlayerFromIdentifier(TargetPlayer.identifier)
                    Player.removeAccountMoney("bank", tonumber(data.amount))
                    trgtSrcPlayer.addAccountMoney("bank", tonumber(data.amount))
                    local message = "Money sent!"
                    TriggerClientEvent("hsn-phone-client:NewNotification",source,{type = "message",message = message, icon = '<i class="fas fa-university"></i>', background = "rgb(177, 52, 59)", app = "Bank", duration = 3000})
                    local message2 = "You received "..data.amount.."$"
                    TriggerClientEvent("hsn-phone-client:NewNotification",trgtSrcPlayer.source,{type = "message",message = message2, icon = '<i class="fas fa-university"></i>', background = "rgb(177, 52, 59)", app = "Bank", duration = 3000})
                    --TriggerClientEvent("hsn-phone-client-sendMoney",source,returnData)
                    HSN.AddRecentTransfer(Player.identifier,trgtSrcPlayer.identifier, data.iban, data.amount, true)
                    HSN.AddRecentTransfer(trgtSrcPlayer.identifier,Player.identifier, data.iban, data.amount, false)
                    TriggerClientEvent("hsn-phone-client-UpdateBankBalance",source, Player.getAccount("bank").money)
                    TriggerClientEvent("hsn-phone-client-UpdateBankBalance",trgtSrcPlayer.source, trgtSrcPlayer.getAccount("bank").money)
                else
                    --TriggerClientEvent("hsn-phone-client-sendMoney",source,returnData)
                    local message = "The IBAN unknown!"
                    TriggerClientEvent("hsn-phone-client:NewNotification",source,{type = "message",message = message, icon = '<i class="fas fa-university"></i>', background = "rgb(177, 52, 59)", app = "Bank", duration = 3000})
                end
            end
        else

        end
    end
end)

-- HSN.AddRecentTransfer = function(identifier, trgtidentifier,iban, amount, date, isSend) 
--     local recentData = {}
--     if PhoneData[identifier].recenttransfers == nil then
--         PhoneData[identifier].recenttransfers = {}
--     end
--     local fullname = HSN.GetPlayerCharacterName(trgtidentifier)
--     if fullname.firstName and fullname.lastname then
--         recentData.name = fullname.firstName.." "..fullname.lastname
--     else
--         recentData.name = "Unknown"
--     end
--     recentData.iban = iban
--     recentData.amount = amount
--     recentData.isSend = isSend
--     table.insert(PhoneData[identifier].recenttransfers,recentData)
-- end




HSN.GetPlayerCharacterName = function(identifier) 
    if identifier == nil then return "Unknown" end
    local result = exports.ghmattimysql:executeSync('SELECT * FROM users WHERE identifier = @identifier', {
		['@identifier']  = identifier
	})
    if result[1].firstname and result[1].lastname then
        return {
            firstname = result[1].firstname,
            lastname = result[1].lastname
        }
    end
end



--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--   Mail

ESX.RegisterServerCallback("hsn-phone-server-getMails",function(source,cb)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    if PhoneData[Player.identifier].mails == nil then
        PhoneData[Player.identifier].mails = {}
    end
    cb(PhoneData[Player.identifier].mails)
end)

ESX.RegisterServerCallback("hsn-phone-server-getMail",function(source,cb,id)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    local returnData = {}
    if PhoneData[Player.identifier].mails == nil then
        PhoneData[Player.identifier].mails = {}
    end
    for k,v in pairs(PhoneData[Player.identifier].mails) do
        if v.id == tonumber(id) then
            returnData = v
            break
        end
    end
    cb(returnData)
end)

RegisterCommand("sendnewmail",function(source)
    local src = source
    TriggerClientEvent("hsn-phone-client-addNewMail",src,{app = "Hasan", message = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum."})
end)

RegisterServerEvent("hsn-phone-server-addNewMail")
AddEventHandler("hsn-phone-server-addNewMail",function(data)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    if PhoneData[Player.identifier].mails == nil then
        PhoneData[Player.identifier].mails = {}
    end
    exports.ghmattimysql:execute('INSERT INTO hsn_phone_mails (owner, message,date,app) VALUES (@owner, @message, @date, @app)', {
        ['@owner']   = Player.identifier,
        ['@message']   = data.message,
        ["@date"] = data.date,
        ["@app"] = data.app
    })
    local id = math.random(1500)
    data.id = id
    table.insert(PhoneData[Player.identifier].mails,data)
    TriggerClientEvent("hsn-phone-client-addNewMailToPage",src,data)
    TriggerClientEvent("hsn-phone-client:NewNotification",src,{type = "message",message = data.message, icon = '<i class="far fa-envelope"></i>', background = "rgb(154, 9, 202)", app = "Mail"})
end)




RegisterServerEvent("hsn-phone-server-deletemail")
AddEventHandler("hsn-phone-server-deletemail",function(id)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    for k,v in pairs(PhoneData[Player.identifier].mails) do
        if v.id == tonumber(id) then
            table.remove(PhoneData[Player.identifier].mails,k)
            exports.ghmattimysql:execute('DELETE FROM hsn_phone_mails WHERE id = @id', {
                ['@id'] = tonumber(id)
            })
            TriggerClientEvent("hsn-phone-client-deletemail",src,id)
            break
        end
    end
end)





ESX.RegisterServerCallback("hsn-phone-server-GetActiveJob",function(source,cb,job)
    local src = source
    local Players = ESX.GetPlayers()
    local jobPlayers = {}
    for k,v in pairs(Players) do
        local Player = ESX.GetPlayerFromId(v)
        if Player.job.name == job then
            local data = {}
            data.firstname = PhoneData[Player.identifier].charinfo.firstname
            data.lastname  = PhoneData[Player.identifier].charinfo.lastname
            data.phonenumber = PhoneData[Player.identifier].phonenumber
            table.insert(jobPlayers,data)
        end
    end
    if #jobPlayers >= 1 then
        cb(jobPlayers)
    else
        cb("")
    end
end)



ESX.RegisterServerCallback("hsn-phone-server-getPlayerCars",function(source,cb)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    local returndata = {}
    local result = exports.ghmattimysql:executeSync('SELECT * FROM owned_vehicles WHERE owner = @owner', {
		['@owner']  = Player.identifier
	})
    if result[1] ~= nil then
        for k,v in pairs(result) do
            table.insert(returndata,v)
        end
    end
    cb(returndata)
end)

RegisterServerEvent("hsn-phone-server-SetCarOut")
AddEventHandler("hsn-phone-server-SetCarOut",function(plate)
    if plate ~= nil then
        exports.ghmattimysql:execute('UPDATE owned_vehicles SET stored = @stored WHERE plate = @plate', {
            ['@stored'] = 0,
            ['@plate'] = plate
        })   
    end
end)



ESX.RegisterServerCallback("hsn-phone-server:GetItemCount",function(source,cb,item)
    local xPlayer = ESX.GetPlayerFromId(source)

    if xPlayer ~= nil then
        local HasPhone = xPlayer.getInventoryItem("phone").count

        if HasPhone >= 1 then
            cb(true)
        else
            cb(false)
        end
    end
end)

RegisterServerEvent("hsn-phone-server-call")
AddEventHandler("hsn-phone-server-call",function(number, anonymouscall)
    print("11")
    local srcPlayer = ESX.GetPlayerFromId(source)
    local srcPlayeri = HSN.GetPlayerFromPhoneNumber(PhoneData[srcPlayer.identifier].phonenumber)
    local Player = HSN.GetPlayerFromPhoneNumber(number)
    if Player == "" then
        TriggerClientEvent("hsn-phone-client-call", source, false, "The person is not available!")
    else
        if Player.identifier then
            if ESX.GetPlayerFromIdentifier(Player.identifier) then
               if ESX.GetPlayerFromIdentifier(Player.identifier).source == source then
                   return TriggerClientEvent("hsn-phone-client-call", source, false, "You cannot call yourself!")
                end
                for k,v in pairs(PhoneCalls) do
                    if v.src == source or v.targetSrc == source then
                        return
                    end
                end
                local callid = HSN.GenerateCallId()
                if not anonymouscall then
                    PhoneCalls[callid] = {}
                    PhoneCalls[callid].src = source
                    PhoneCalls[callid].targetSrc = ESX.GetPlayerFromIdentifier(Player.identifier).source
                    PhoneCalls[callid].srcPhoto = srcPlayeri.charinfo.photo
                    PhoneCalls[callid].targetPhoto = Player.charinfo.photo
                else
                    PhoneCalls[callid] = {}
                    PhoneCalls[callid].src = source
                    PhoneCalls[callid].targetSrc = ESX.GetPlayerFromIdentifier(Player.identifier).source
                    PhoneCalls[callid].srcPhoto = './images/default.png'
                    PhoneCalls[callid].targetPhoto = Player.charinfo.photo
                end
                

                local fullName = Player.charinfo.lastname.." "..Player.charinfo.lastname
                local targetphoto = Player.charinfo.photo
                local srcPlayerPhoto = srcPlayeri.charinfo.photo
                if NumberInContact(srcPlayer.identifier, number) then
                    TriggerClientEvent("hsn-phone-client:NewNotification",source,{type = "call-src", message = fullName.." calling!", targetNumber = Player.phonenumber, id = callid})
                else
                    TriggerClientEvent("hsn-phone-client:NewNotification",source,{type = "call-src", message = number.." calling!", targetNumber = Player.phonenumber, id = callid})
                end
                if anonymouscall then
                    TriggerClientEvent("hsn-phone-client:NewNotification",ESX.GetPlayerFromIdentifier(Player.identifier).source,{type = "call-target", message = "Unknown Number !", targetNumber = Player.phonenumber, id = callid})
                else
                    if NumberInContact(Player.identifier, PhoneData[srcPlayer.identifier].phonenumber) then
                        TriggerClientEvent("hsn-phone-client:NewNotification",ESX.GetPlayerFromIdentifier(Player.identifier).source,{type = "call-target", message = fullName.." ringing!", targetNumber = Player.phonenumber, id = callid})
                    else
                        TriggerClientEvent("hsn-phone-client:NewNotification",ESX.GetPlayerFromIdentifier(Player.identifier).source,{type = "call-target", message = PhoneData[srcPlayer.identifier].phonenumber.." ringing!", targetNumber = Player.phonenumber, id = callid})
                    end
                end
            else
                TriggerClientEvent("hsn-phone-client-call", source, false, "The person is not available!")
            end
        else
            TriggerClientEvent("hsn-phone-client-call", source, false, "The person is not available!")
        end
    end
end)

RegisterServerEvent("hsn-phone-server-answercall")
AddEventHandler("hsn-phone-server-answercall",function(type)
    if (type == "cancelcall") then
        for k,v in pairs(PhoneCalls) do
            if v.src == source then
                
                TriggerClientEvent("hsn-phone-client-answercall",v.src, type,"", k)
                if ESX.GetPlayerFromId(v.targetSrc) then
                    TriggerClientEvent("hsn-phone-client-answercall",v.targetSrc, type, "", k)
                end
                PhoneCalls[k] = nil
                break
            end
        end
    elseif (type == "accept") then
        for k,v in pairs(PhoneCalls) do
            if v.targetSrc == source then
                if ESX.GetPlayerFromId(v.src) then
                    TriggerClientEvent("hsn-phone-client-answercall",v.src, type,v.targetPhoto, k)
                end
                TriggerClientEvent("hsn-phone-client-answercall",v.targetSrc, type,v.srcPhoto, k)
                break
            end
        end
    elseif (type == "decline") then
        for k,v in pairs(PhoneCalls) do
            if v.targetSrc == source or v.src == source then
                if ESX.GetPlayerFromId(v.src) then
                    TriggerClientEvent("hsn-phone-client-answercall",v.src, type,"", k)
                end
                TriggerClientEvent("hsn-phone-client-answercall",v.targetSrc, type,"", k)
                PhoneCalls[k] = nil
                break
            end
        end
    end
end)



RecentValues = {}
local fncvalues = {"bitcoin", "devcoin", "ethereum", "ggcoin"}
Changes = {}
Citizen.CreateThread(function()
    PerformHttpRequest("https://api.cryptonator.com/api/ticker/btc-usd", function(param1, param2, param3)
        param2 = json.decode(param2)
        local btcprice = tonumber(param2.ticker.price)
        CryptoCurrency["bitcoin"] = string.format("%.32f", 1 / btcprice)
    end)
    PerformHttpRequest("https://api.cryptonator.com/api/ticker/doge-usd", function(param1, param2, param3)
        param2 = json.decode(param2)
        local devprice = tonumber(param2.ticker.price)
        CryptoCurrency["devcoin"] = string.format("%.32f", 1 / devprice)
    end)
    PerformHttpRequest("https://api.cryptonator.com/api/ticker/eth-usd", function(param1, param2, param3)
        param2 = json.decode(param2)
        local ethprice = tonumber(param2.ticker.price)
        CryptoCurrency["ethereum"] = string.format("%.32f", 1 / ethprice)
    end)
    PerformHttpRequest("https://api.cryptonator.com/api/ticker/xtz-usd", function(param1, param2, param3)
        param2 = json.decode(param2)
        local ggcoinprice = tonumber(param2.ticker.price)
        CryptoCurrency["ggcoin"] = string.format("%.32f", 1 / ggcoinprice)
    end)
    while true do
        Citizen.Wait(60000)
        PerformHttpRequest("https://api.cryptonator.com/api/ticker/btc-usd", function(param1, param2, param3)
            param2 = json.decode(param2)
            local btcprice = tonumber(param2.ticker.price)
            CryptoCurrency["bitcoin"] = string.format("%.32f", 1 / btcprice)
        end)
        PerformHttpRequest("https://api.cryptonator.com/api/ticker/doge-usd", function(param1, param2, param3)
            param2 = json.decode(param2)
            local devprice = tonumber(param2.ticker.price)
            CryptoCurrency["devcoin"] = string.format("%.32f", 1 / devprice)
        end)
        PerformHttpRequest("https://api.cryptonator.com/api/ticker/eth-usd", function(param1, param2, param3)
            param2 = json.decode(param2)
            local ethprice = tonumber(param2.ticker.price)
            CryptoCurrency["ethereum"] = string.format("%.32f", 1 / ethprice)
        end)
        PerformHttpRequest("https://api.cryptonator.com/api/ticker/xtz-usd", function(param1, param2, param3)
            param2 = json.decode(param2)
            local ggcoinprice = tonumber(param2.ticker.price)
            CryptoCurrency["ggcoin"] = string.format("%.32f", 1 / ggcoinprice)
        end)
        for i,j in pairs(fncvalues) do
            while CryptoCurrency[j] == nil do
                Citizen.Wait(100)
            end
            if RecentValues[j] == nil then
                RecentValues[j] = {}
                RecentValues[j] = CryptoCurrency[j]
            end
            Changes[j] = {}
            
            if RecentValues[j] > CryptoCurrency[j] then
                Changes[j].change = "up"
            elseif RecentValues[j] < CryptoCurrency[j] then
                Changes[j].change = "down"
            elseif RecentValues[j] == CryptoCurrency[j] then
                Changes[j].change = "same"
            end
        end
        TriggerClientEvent("hsn-phone-client-updateCryptoChanges",-1,Changes)
    end
end)


RegisterServerEvent("hsn-phone-server-BuyCryptoCurrency")
AddEventHandler("hsn-phone-server-BuyCryptoCurrency",function(type, amount, crypto)
    print(type, amount, crypto)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    local cryptoData = PhoneData[Player.identifier].CryptoCurrency
    if type and amount and crypto then
        if amount == "" then return end
        amount = tonumber(amount)
        if amount == 0 then return end
        if cryptoData then
            if cryptoData[crypto] then
                if type == "buy" then
                    if Player.getAccount("bank").money >= amount then
                        Player.removeAccountMoney("bank", amount)
                        local value = HSN.CalculateCryptoValue(crypto, amount)
                        print("value "..value)
                        PhoneData[Player.identifier].CryptoCurrency[crypto] = PhoneData[Player.identifier].CryptoCurrency[crypto] + value
                        exports.ghmattimysql:execute('UPDATE users SET cryptocurrency = @cryptocurrency WHERE identifier = @identifier', {
                            ['@cryptocurrency'] = json.encode(PhoneData[Player.identifier].CryptoCurrency),
                            ['@identifier'] = Player.identifier
                        }) 
                        TriggerClientEvent("hsn-phone-client-UpdateMyCryptos",src, crypto, PhoneData[Player.identifier].CryptoCurrency[crypto])
                        local valueformessage = HSN.MathRound(value,4)
                        local message = "You bought "..valueformessage.." "..crypto.." for $"..amount.."!"
                        TriggerClientEvent("hsn-phone-client:NewNotification",source,{type = "message",message = message, icon = '<i class="fas fa-layer-group"></i>', background = "#e07a5f", app = "Finance"})
                        TriggerClientEvent("hsn-phone-client-UpdateBankBalance",source, Player.getAccount("bank").money)
                    else
                        TriggerClientEvent("hsn-phone-client-PhoneShowNotification",src, "You don't have enough money!", "error")
                    end
                elseif type == "sell" then
                    if PhoneData[Player.identifier].CryptoCurrency[crypto] >= amount then
                        local BackPrice = (amount / CryptoCurrency[crypto])
                        BackPrice = math.floor(BackPrice)
                        PhoneData[Player.identifier].CryptoCurrency[crypto] = string.format("%.32f", PhoneData[Player.identifier].CryptoCurrency[crypto] - amount) 
                        Player.addAccountMoney("bank", BackPrice)
                        local message = "You sold "..HSN.MathRound(amount,7).." "..crypto.."!"
                        TriggerClientEvent("hsn-phone-client:NewNotification",source,{type = "message",message = message, icon = '<i class="fas fa-layer-group"></i>', background = "#e07a5f", app = "Finance"})
                        TriggerClientEvent("hsn-phone-client-UpdateMyCryptos",src, crypto, PhoneData[Player.identifier].CryptoCurrency[crypto])
                        TriggerClientEvent("hsn-phone-client-UpdateBankBalance",source, Player.getAccount("bank").money)
                        exports.ghmattimysql:execute('UPDATE users SET cryptocurrency = @cryptocurrency WHERE identifier = @identifier', {
                            ['@cryptocurrency'] = json.encode(PhoneData[Player.identifier].CryptoCurrency),
                            ['@identifier'] = Player.identifier
                        }) 
                    end
                end
            end
        end
    end
end)



RegisterServerEvent("hsn-phone-server-TransferCrypto")
AddEventHandler("hsn-phone-server-TransferCrypto",function(crypto, amount, targetCryptoId)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    local cryptoData = PhoneData[Player.identifier].CryptoCurrency
    if type and amount and crypto then
        if amount == "" then return end
        amount = tonumber(amount)
        if amount == nil then
            return
        end
        if amount == 0 or amount < 0 then return end
        if cryptoData then
            if cryptoData[crypto] then
                local TargetPlayer = HSN.GetPlayerFromCryptoId(targetCryptoId)
                if TargetPlayer == nil then
                    return  TriggerClientEvent("hsn-phone-client-PhoneShowNotification",src, "We can't find this id!", "error")
                end
                if PhoneData[Player.identifier].CryptoCurrency[crypto] >= amount then
                    PhoneData[Player.identifier].CryptoCurrency[crypto] = PhoneData[Player.identifier].CryptoCurrency[crypto] - amount
                    PhoneData[TargetPlayer].CryptoCurrency[crypto] = PhoneData[TargetPlayer].CryptoCurrency[crypto] + (amount - HSN.CalculateCryptoCommission(crypto, amount))
                    TriggerClientEvent("hsn-phone-client-UpdateMyCryptos",src, crypto, PhoneData[Player.identifier].CryptoCurrency[crypto])
                    local komisyon = HSN.CalculateCryptoCommission(crypto, amount)
                    local gonderdigimpara = amount
                    if ESX.GetPlayerFromIdentifier(TargetPlayer) then
                        local message = HSN.MathRound(amount - HSN.CalculateCryptoCommission(crypto, amount),4).." came to your "..crypto.." acc!"
                        --TriggerClientEvent("hsn-phone-client:NewNotification",ESX.GetPlayerFromIdentifier(TargetPlayer).source,{type = "message",message = message, icon = '<i class="fas fa-layer-group"></i>', background = "#e07a5f", app = "Finance"})
                    end
                    local message = "You have transferred"..HSN.MathRound(amount,4)
                    TriggerClientEvent("hsn-phone-client:NewNotification",source,{type = "message",message = message, icon = '<i class="fas fa-layer-group"></i>', background = "#e07a5f", app = "Finance"})
                    exports.ghmattimysql:execute('UPDATE users SET cryptocurrency = @cryptocurrency WHERE identifier = @identifier', {
                        ['@cryptocurrency'] = json.encode(PhoneData[Player.identifier].CryptoCurrency),
                        ['@identifier'] = Player.identifier
                    }) 
                    exports.ghmattimysql:execute('UPDATE users SET cryptocurrency = @cryptocurrency WHERE identifier = @identifier', {
                        ['@cryptocurrency'] = json.encode(PhoneData[TargetPlayer].CryptoCurrency),
                        ['@identifier'] = TargetPlayer
                    })
                    local data = {}
                    data.owner = Player.identifier
                    data.crypto = crypto
                    data.amount = amount
                    data.target = targetCryptoId
                    table.insert(PhoneData[Player.identifier].cryptocurrencytransfers, data)
                    data.id = #PhoneData[Player.identifier].cryptocurrencytransfers
                    exports.ghmattimysql:execute('UPDATE users SET cryptocurrencytransfers = @cryptocurrencytransfers WHERE identifier = @identifier', {
                        ['@cryptocurrencytransfers'] = json.encode(PhoneData[Player.identifier].cryptocurrencytransfers),
                        ['@identifier'] = Player.identifier
                    })
                    
                    TriggerClientEvent("hsn-phone-clinet:AddNewCryptoTransfer",source,data)
                else
                    TriggerClientEvent("hsn-phone-client-PhoneShowNotification",src, "You don't have enough "..crypto.." !", "error")
                end
            end
        end
    end
end)


HSN.CalculateCryptoCommission = function(crypto, amount)
    local commission = Config.CryptoTransferCommission[crypto]
    if commission == nil then commission = 0 end
    return (amount / 100) * commission 
end



HSN.CalculateCryptoValue = function(crypto, amount)
    if crypto and amount then
        if CryptoCurrency[crypto] then
            return CryptoCurrency[crypto] * amount
        end
    end
end


ESX.RegisterServerCallback("hsn-phone-server-GetCryptoTransactions",function(source,cb)
    local Player = ESX.GetPlayerFromId(source)
    cb(PhoneData[Player.identifier].cryptocurrencytransfers)
end)


RegisterServerEvent("hsn-phone-server-CreateNewPatientData")
AddEventHandler("hsn-phone-server-CreateNewPatientData",function(patientData)
    local id = nil
    if patientData then
        if patientData.name ~= "" and patientData.message ~= "" then
            patientData.id = math.random(1561)
            exports.ghmattimysql:execute('INSERT INTO hsn_phone_ambulancepatients (name, message,photo,date, id) VALUES (@name, @message, @photo, @date, @id)', {
                ['@name']   = patientData.name,
                ['@message']   = patientData.message,
                ["@photo"] = patientData.photo,
                ["@date"] = patientData.date,
                ["id"] = patientData.id
            })
            table.insert(AmbulancePatientDatas, patientData)
            TriggerClientEvent("hsn-phone-client-CreateNewPatientData",source, patientData)
        end
    end
end)


RegisterServerEvent("hsn-phone-server-DeletePatientData")
AddEventHandler("hsn-phone-server-DeletePatientData",function(patientData)
    print(patientData.patient)
    if patientData and patientData.patient then
        patientData.patient = tonumber(patientData.patient)
        for k,v in pairs(AmbulancePatientDatas) do
            if v.id == patientData.patient then
                table.remove(AmbulancePatientDatas, k)
                TriggerClientEvent("hsn-phone-client-DeletePatientData", source, patientData.patient)
                print("asdasdasd")
                exports.ghmattimysql:execute('DELETE FROM hsn_phone_ambulancepatients WHERE id = @id', {
                    ['@id'] = patientData.patient,
                })
                break
            end
        end
    end
end)


ESX.RegisterServerCallback("hsn-phone-server-GetPatientDatas",function(source,cb)
    cb(AmbulancePatientDatas)
end)


ESX.RegisterServerCallback("hsn-phone-server-SearchCitizen",function(source, cb, searchData)
    local playersTable = {}
    local result = exports.ghmattimysql:executeSync("SELECT * FROM users WHERE CONCAT(firstname, ' ', lastname) LIKE '%"..searchData.."%' OR phone_number LIKE '%"..searchData.."%'")
    if result[1] ~= nil then
        for k,v in pairs(result) do
            if v.phonedata ~= nil then
                v.phonedata = json.decode(v.phonedata)
            else
                v.phonedata = {}
                v.phonedata.photo = "https://cdn.discordapp.com/attachments/826784608376455178/834637030255755276/default.png"
            end
            if v.bolos ~= nil then
                v.bolos = json.decode(v.bolos)
            else
                v.bolos = {}
            end

            table.insert(playersTable, v)
        end
    end
    cb(playersTable)
end)


ESX.RegisterServerCallback("hsn-phone-server-SearchVehicle",function(source, cb, searchData)
    local vehicleTable = {}
    local result = exports.ghmattimysql:executeSync("SELECT * FROM owned_vehicles WHERE CONCAT(plate) LIKE '%"..searchData.."%'")
    if result[1] ~= nil then
        for k,v in pairs(result) do
            if PhoneData[v.owner] then
                carowner = PhoneData[v.owner].charinfo.firstname ..' '..PhoneData[v.owner].charinfo.lastname
                vehicledata = json.decode(v.vehicle)
                if v.stored == 1 then
                    v.stored = "Yes"
                else
                    v.stored = "No"
                end
                table.insert(vehicleTable,{carowner = carowner, vehicledata = vehicledata, plate = v.plate, stored = v.stored})
            end
        end
    end
    cb(vehicleTable)
end)


RegisterServerEvent("hsn-phone-server-addnewbolo")
AddEventHandler("hsn-phone-server-addnewbolo",function(bolo)
    if bolo then
        if bolo.reason then
            if bolo.player ~= nil or bolo.player ~= "0" or bolo.player ~= 0 then
                if Bolos[bolo.player] == nil then
                    Bolos[bolo.player] = {}
                end
                bolo.id = math.random(1500)
                table.insert(Bolos[bolo.player], bolo)
                exports.ghmattimysql:execute('UPDATE users SET bolos = @bolos WHERE identifier = @identifier', {
                    ['@bolos'] = json.encode(Bolos[bolo.player]),
                    ['@identifier'] = bolo.player
                }) 
                TriggerClientEvent("hsn-phone-client-addnewbolo",source, bolo )
            end
        end
    end
end)

RegisterServerEvent("hsn-phone-server-DeleteBolo")
AddEventHandler("hsn-phone-server-DeleteBolo",function(bolodata)
    if bolodata then
        if bolodata.Player then
            if bolodata.boloid then
                if Bolos[bolodata.Player] then
                    for k,v in pairs(Bolos[bolodata.Player]) do
                        print(json.encode(v))
                        if v.id ~= nil and v.id == tonumber(bolodata.boloid) then
                            table.remove(Bolos[bolodata.Player], k)
                            exports.ghmattimysql:execute('UPDATE users SET bolos = @bolos WHERE identifier = @identifier', {
                                ['@bolos'] = json.encode(Bolos[bolodata.Player]),
                                ['@identifier'] = bolodata.Player
                            }) 
                            TriggerClientEvent("hsn-phone-client-DeleteBolo", source, bolodata.boloid)
                            break
                        end
                    end
                end
            end
        end
    end
end)

-- RegisterNetEvent("hsn-phone-server-WalkNotify")
-- AddEventHandler("hsn-phone-server-WalkNotify",function(new)
--     local src = source
--     local Player = ESX.GetPlayerFromId(src)
--     if Player then
--         if Walks[Player.identifier] == nil then
--             Walks[Player.identifier] = 0
--         end
--         Walks[Player.identifier] = Walks[Player.identifier] + tonumber(new)
--         SendHealthMessage(src, Walks[Player.identifier])
--     end
-- end)



-- SendHealthMessage = function(src, amount)
--     if src then
--         if amount >= 200 then
--             local message = amount.." adım koştun"
--             TriggerClientEvent("hsn-phone-client:NewNotification",source,{type = "message",message = message, icon = '<i class="fas fa-heartbeat"></i>', background = "#2a9d8f", app = "Health"})
--         end
--     end
-- end

RegisterNetEvent("hsn-phone-server:AddNewAdvertisements")
AddEventHandler("hsn-phone-server:AddNewAdvertisements",function(data)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    if data.text then
        local fullname = PhoneData[Player.identifier].charinfo.firstname.. " "..PhoneData[Player.identifier].charinfo.lastname
        local ndata = {}
        ndata.name = fullname
        ndata.playerphoto = PhoneData[Player.identifier].charinfo.photo or "default"
        ndata.phonenumber = PhoneData[Player.identifier].phonenumber ~= nil and PhoneData[Player.identifier].phonenumber or HSN.GeneratePhoneNumber(Player.identifier)
        ndata.id = math.random(10000)
        ndata.text = data.text
        ndata.photo = data.photo
        ndata.senderidentifier = Player.identifier
        table.insert(Advertisements, ndata)
        TriggerClientEvent("hsn-phone-client:addNewAdd",-1, ndata)
    end
end)

RegisterNetEvent("hsn-phone-server:DeleteAdvertisement")
AddEventHandler("hsn-phone-server:DeleteAdvertisement",function(id)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    if id ~= nil then
        for k,v in pairs(Advertisements) do
            if v.id == tonumber(id) then
                table.remove(Advertisements, k)
                TriggerClientEvent("hsn-phone-client:deleteadd",-1, id)
                break
            end 
        end
    end
end)

RegisterNetEvent("hsn-phone-server:EditAdvertisement")
AddEventHandler("hsn-phone-server:EditAdvertisement",function(id, newtext)
    local src = source
    local Player = ESX.GetPlayerFromId(src)
    if id ~= nil then
        for k,v in pairs(Advertisements) do
            if v.id == tonumber(id) then
                v.text = newtext
                TriggerClientEvent("hsn-phone-server:EditAdvertisement",-1, id, newtext)
                break
            end 
        end
    end
end)


ESX.RegisterServerCallback("hsn-phone-server:GetAdds",function(source, cb)
    cb(Advertisements)
end)




RegisterServerEvent("hsn-phone-server-SendMessage")
AddEventHandler("hsn-phone-server-SendMessage",function(data)
    print(data.number)
    local Player = ESX.GetPlayerFromId(source)
    if PhoneData[Player.identifier].messages == nil then
        PhoneData[Player.identifier].messages = {}
    end
    if PhoneData[Player.identifier].messages[data.number] == nil then
        PhoneData[Player.identifier].messages[data.number] = {}
    end
    PhoneData[Player.identifier].messages[data.number].lastmessage =  data.message
    PhoneData[Player.identifier].messages[data.number].lastmessagetime = data.time
    if PhoneData[Player.identifier].messages[data.number].localmessages == nil then
        PhoneData[Player.identifier].messages[data.number].localmessages = {}
    end
    local TPlayer = HSN.GetPlayerFromPhoneNumber(data.number)
    PhoneData[Player.identifier].messages[data.number].playerphoto =  TPlayer ~= "" and TPlayer.charinfo.photo or "default"
    PhoneData[Player.identifier].messages[data.number].name  = FormatGetContact(Player.identifier, data.number)
    local MessageData = {}
    MessageData.message = data.message
    MessageData.photo = data.photo
    if data.gps ~= nil then
        MessageData.gps = json.decode(data.gps)
    end
    MessageData.sender = "me"
    MessageData.messagetime = data.messagetime
    table.insert(PhoneData[Player.identifier].messages[data.number].localmessages, MessageData)
    TriggerClientEvent("hsn-phone-client-updatemessages",source, MessageData, PhoneData[Player.identifier].messages, data.number)
    local result = exports.ghmattimysql:executeSync('SELECT * FROM hsn_phone_messages WHERE owner = @owner AND number = @number', {
		['@owner']  = Player.identifier,
        ['@number'] = data.number
	})
    if result[1] then
        exports.ghmattimysql:execute('UPDATE hsn_phone_messages SET data = @data, date = @date, number = @number WHERE owner = @owner AND number = @number', {
            ['@data'] = json.encode(PhoneData[Player.identifier].messages[data.number]),
            ['@owner'] = Player.identifier,
            ['@number'] = data.number,
            ['@date'] = os.date('%Y-%m-%d %H:%M:%S')
        })
    else
        print("bos")
        exports.ghmattimysql:execute('INSERT INTO hsn_phone_messages (data, owner, number, date) VALUES (@data, @owner, @number, @date)', {
            ['@owner']   = Player.identifier,
            ['@data']   = json.encode(PhoneData[Player.identifier].messages[data.number]),
            ['@number'] = data.number,
            ['@date'] = os.date('%Y-%m-%d %H:%M:%S')
        })
    end
    
    local Target = HSN.GetPlayerFromPhoneNumber(data.number)
    if  Target ~= "" then
        local ESXTARGETPLAYER = ESX.GetPlayerFromIdentifier(Target.identifier)
        if ESXTARGETPLAYER then
            local srcPlayerPhoneNumber = PhoneData[Player.identifier].phonenumber
            if PhoneData[ESXTARGETPLAYER.identifier].messages == nil then
                PhoneData[ESXTARGETPLAYER.identifier].messages = {}
            end
            if PhoneData[ESXTARGETPLAYER.identifier].messages[srcPlayerPhoneNumber] == nil then
                PhoneData[ESXTARGETPLAYER.identifier].messages[srcPlayerPhoneNumber] = {}
            end
            PhoneData[ESXTARGETPLAYER.identifier].messages[srcPlayerPhoneNumber].lastmessage = data.message
            PhoneData[ESXTARGETPLAYER.identifier].messages[srcPlayerPhoneNumber].lastmessagetime = data.time
            if PhoneData[ESXTARGETPLAYER.identifier].messages[srcPlayerPhoneNumber].localmessages == nil then
                PhoneData[ESXTARGETPLAYER.identifier].messages[srcPlayerPhoneNumber].localmessages = {}
            end
            PhoneData[ESXTARGETPLAYER.identifier].messages[srcPlayerPhoneNumber].playerphoto =  PhoneData[Player.identifier].charinfo.photo ~= nil and PhoneData[Player.identifier].charinfo.photo or "default"
            PhoneData[ESXTARGETPLAYER.identifier].messages[srcPlayerPhoneNumber].name  = FormatGetContact(ESXTARGETPLAYER.identifier, srcPlayerPhoneNumber)
            local MessageData = {}
            MessageData.message = data.message
            MessageData.photo = data.photo
            if data.gps ~= nil then
                MessageData.gps = json.decode(data.gps)
            end
            MessageData.sender = "target"
            MessageData.messagetime = data.messagetime
            table.insert(PhoneData[ESXTARGETPLAYER.identifier].messages[srcPlayerPhoneNumber].localmessages, MessageData)
            TriggerClientEvent("hsn-phone-client-updatemessages",ESXTARGETPLAYER.source, MessageData, PhoneData[ESXTARGETPLAYER.identifier].messages, PhoneData[Player.identifier].phonenumber )
            TriggerClientEvent("hsn-phone-client:NewNotification",ESXTARGETPLAYER.source,{type = "message",message = "New Message from "..FormatGetContact(ESXTARGETPLAYER.identifier, srcPlayerPhoneNumber)..'!', icon = '<i class="fas fa-comment-alt"></i>', background = "#197278", app = "Messages", duration = 3000})
            local result = exports.ghmattimysql:executeSync('SELECT * FROM hsn_phone_messages WHERE owner = @owner AND number = @number', {
                ['@owner']  = ESXTARGETPLAYER.identifier,
                ['@number'] = srcPlayerPhoneNumber
            })
            if result[1] then
                exports.ghmattimysql:execute('UPDATE hsn_phone_messages SET data = @data, date = @date, number = @number WHERE owner = @owner AND number = @number', {
                    ['@data'] = json.encode(PhoneData[ESXTARGETPLAYER.identifier].messages[srcPlayerPhoneNumber]),
                    ['@owner'] = ESXTARGETPLAYER.identifier,
                    ['@number'] = srcPlayerPhoneNumber,
                    ['@date'] = os.date('%Y-%m-%d %H:%M:%S')
                })
            else
                exports.ghmattimysql:execute('INSERT INTO hsn_phone_messages (data, owner, number, date) VALUES (@data, @owner, @number, @date)', {
                    ['@owner']   = ESXTARGETPLAYER.identifier,
                    ['@data']   = json.encode(PhoneData[ESXTARGETPLAYER.identifier].messages[srcPlayerPhoneNumber]),
                    ['@number'] = srcPlayerPhoneNumber,
                    ['@date'] = os.date('%Y-%m-%d %H:%M:%S')
                })
            end




        else
            local srcPlayerPhoneNumber = PhoneData[Player.identifier].phonenumber
            if PhoneData[Target.identifier].messages == nil then
                PhoneData[Target.identifier].messages = {}
            end
            if PhoneData[Target.identifier].messages[srcPlayerPhoneNumber] == nil then
                PhoneData[Target.identifier].messages[srcPlayerPhoneNumber] = {}
            end
            PhoneData[Target.identifier].messages[srcPlayerPhoneNumber].lastmessage = data.message
            PhoneData[Target.identifier].messages[srcPlayerPhoneNumber].lastmessagetime = data.time
            if PhoneData[Target.identifier].messages[srcPlayerPhoneNumber].localmessages == nil then
                PhoneData[Target.identifier].messages[srcPlayerPhoneNumber].localmessages = {}
            end
            PhoneData[Target.identifier].messages[srcPlayerPhoneNumber].playerphoto =  PhoneData[Player.identifier].charinfo.photo ~= nil and PhoneData[Player.identifier].charinfo.photo or "default"
            PhoneData[Target.identifier].messages[srcPlayerPhoneNumber].name  = FormatGetContact(Target.identifier, srcPlayerPhoneNumber)
            local MessageData = {}
            MessageData.message = data.message
            MessageData.photo = data.photo
            if data.gps ~= nil then
                MessageData.gps = json.decode(data.gps)
            end
            MessageData.sender = "target"
            MessageData.messagetime = data.messagetime
            table.insert(PhoneData[Target.identifier].messages[srcPlayerPhoneNumber].localmessages, MessageData)
            --TriggerClientEvent("hsn-phone-client-updatemessages",ESXTARGETPLAYER.source, PhoneData[Target.identifier].messages, PhoneData[Player.identifier].phonenumber )
            local result = exports.ghmattimysql:executeSync('SELECT * FROM hsn_phone_messages WHERE owner = @owner AND number = @number', {
                ['@owner']  = Target.identifier,
                ['@number'] = srcPlayerPhoneNumber
            })
            if result[1] then
                exports.ghmattimysql:execute('UPDATE hsn_phone_messages SET data = @data, date = @date, number = @number WHERE owner = @owner AND number = @number', {
                    ['@data'] = json.encode(PhoneData[Target.identifier].messages[srcPlayerPhoneNumber]),
                    ['@owner'] = Target.identifier,
                    ['@number'] = srcPlayerPhoneNumber,
                    ['@date'] = os.date('%Y-%m-%d %H:%M:%S')
                })
            else
                exports.ghmattimysql:execute('INSERT INTO hsn_phone_messages (data, owner, number, date) VALUES (@data, @owner, @number, @date)', {
                    ['@owner']   = Target.identifier,
                    ['@data']   = json.encode(PhoneData[Target.identifier].messages[srcPlayerPhoneNumber]),
                    ['@number'] = srcPlayerPhoneNumber,
                    ['@date'] = os.date('%Y-%m-%d %H:%M:%S')
                })
            end
        end
    end
end)

local StringCharset = {}
local NumberCharset = {}

for i = 48,  57 do table.insert(NumberCharset, string.char(i)) end
for i = 65,  90 do table.insert(StringCharset, string.char(i)) end
for i = 97, 122 do table.insert(StringCharset, string.char(i)) end

HSN.RandomStr = function(length)
	if length > 0 then
		return HSN.RandomStr(length-1) .. StringCharset[math.random(1, #StringCharset)]
	else
		return ''
	end
end
HSN.RandomInt = function(length)
	if length > 0 then
		return HSN.RandomInt(length-1) .. NumberCharset[math.random(1, #NumberCharset)]
	else
		return ''
	end
end

HSN.SplitStr = function(str, delimiter)
	local result = { }
	local from  = 1
	local delim_from, delim_to = string.find( str, delimiter, from  )
	while delim_from do
		table.insert( result, string.sub( str, from , delim_from-1 ) )
		from  = delim_to + 1
		delim_from, delim_to = string.find( str, delimiter, from  )
	end
	table.insert( result, string.sub( str, from  ) )
	return result
end


HSN.MathRound = function(value, numDecimalPlaces)
	if numDecimalPlaces then
		local power = 10^numDecimalPlaces
		return math.floor((value * power) + 0.5) / (power)
	else
		return math.floor(value + 0.5)
	end
end

HSN.GenerateRandomMessageId = function()
    return math.random(99999)
end

HSN.SendLog = function(app, webhook, message, photo, playerphoto)
    local webhook = webhook
    if webhook == '' then
        return
    end



    local headers = {
        ['Content-Type'] = 'application/json'
    }
    local data = {
        ["username"] = app,
        ["embeds"] = {{
            ["thumbnail"] = {
                ["url"] = playerphoto
            },
            ["color"] = 1942002
        }}
    }
    if image ~= "" then
        data['embeds'][1]['image'] = {['url'] = photo}
    end
    data['embeds'][1]['description'] = '**New Tweet!** \n ' ..message
    PerformHttpRequest(webhook, function(err, text, headers) end, 'POST', json.encode(data), headers)
end


