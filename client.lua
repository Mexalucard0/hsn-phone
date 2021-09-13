ESX = nil
local HSN = {}
HSN.PhoneIsOpened = false
HSN.EnableAnonymousCall = false
HSN.PlayerIsDead = false
HSN.InCall = false
HSN.InCallL = false
HSN.CancelCall = false
HSN.PlayerData = {}
HSN.Config = {}
Citizen.CreateThread(function()
    while ESX == nil do
        TriggerEvent("esx:getSharedObject",function(obj)
            ESX = obj
        end)
        Citizen.Wait(1)
    end
    while ESX.GetPlayerData().job == nil do
        Citizen.Wait(10)
    end
    HSN.PlayerData = ESX.GetPlayerData()
    --if ESX.IsPlayerLoaded() then
        Citizen.Wait(1000)
        if Config.JobNames[HSN.PlayerData.job.name] ~= nil then
            SendNUIMessage({
                message = "SetJobApp",
                job = HSN.PlayerData.job.name
            })
        end
    --end
end)

Citizen.CreateThread(function()
    RegisterKeyMapping("OpenPhone", "Open Phone", "keyboard", "F1") --Removed Bind System and added standalone version
    RegisterCommand('OpenPhone', OpenPhone, false)
    TriggerEvent("chat:removeSuggestion", "/OpenPhone")
    if Config.TelfixCommand ~= nil and Config.TelfixCommand ~= "" then
        RegisterCommand(Config.TelfixCommand,function()
            HSN.ClosePhone()
        end)
    end
end)




    

OpenPhone = function()
    --if ESX.IsPlayerLoaded() then
        ESX.TriggerServerCallback("hsn-phone-server:GetItemCount",function(phoneCount)
            if phoneCount then
                if not HSN.PlayerIsDead then
                    SetNuiFocus(true, true)
                    ESX.TriggerServerCallback("hsn-phone-server-getcharinfo",function(result)
                        SendNUIMessage({
                            message = "open",
                            result = result,
                            cryptoCommissions = Config.CryptoTransferCommission,
                            PhoneBackgrounds = Config.PhoneBackgrounds,
                            Musics = Config.CallSounds,
                            ServerInfo = Config.Server,
                            EnableAnonymousCall = HSN.EnableAnonymousCall,
                            Identifier = HSN.PlayerData.identifier
                        })
                    end)
                    PhonePlayIn()
                    HSN.PhoneIsOpened = true
                else
                    ESX.ShowNotification("You are dead!")
                end
            else
                ESX.ShowNotification("You don't have any phone!")
            end
        end,"phone")
    --end
end


RegisterNetEvent('esx:setJob')
AddEventHandler('esx:setJob', function(job)
	if Config.JobNames[job.name] ~= nil then
        SendNUIMessage({
            message = "SetJobApp",
            job = job.name
        })
    end
end)


RegisterNetEvent("hsn-phone-client-updateTwitterData")
AddEventHandler("hsn-phone-client-updateTwitterData",function(twitterData)
    SendNUIMessage({
        message = "UpdateTwitterData",
        data = twitterData
    })
end)


-- events


RegisterNetEvent("hsn-phone-client-addnewbolo")
AddEventHandler("hsn-phone-client-addnewbolo",function(bolo)
    SendNUIMessage({message = "AddNewBolo", bolodata = bolo})
end)

RegisterNetEvent("hsn-phone-client-CreateNewPatientData")
AddEventHandler("hsn-phone-client-CreateNewPatientData",function(patientData)
    SendNUIMessage({message = "CreateNewPatientData", patientData = patientData})
end)


RegisterNetEvent("hsn-phone-clinet:AddNewCryptoTransfer")
AddEventHandler("hsn-phone-clinet:AddNewCryptoTransfer",function(data)
    SendNUIMessage({message = "AddNewCryptoTransfer", data = data})
end)

RegisterNetEvent("hsn-phone-client-answercall")
AddEventHandler("hsn-phone-client-answercall",function(type, photo, id)
    SendNUIMessage({message = "call-answer", type = type, photo = photo, id = id})
    if (type == "accept") then
        HSN.InCall = true
        PhonePlayCall()
        if Config.Voip == "tokovoip" then
            exports['tokovoip_script']:setPlayerData(GetPlayerName(PlayerId()), "call:channel", id, true)
            exports.tokovoip_script:addPlayerToRadio(id)
        elseif Config.Voip == "mumble" then
            exports["mumble-voip"]:SetCallChannel(id+1)
        elseif Config.Voip == "pma-voice" then
            exports["pma-voice"]:SetCallChannel(id+1)
        end
        HSN.InCallL = true
    elseif (type == "decline") then
        PhonePlayText ()
        HSN.InCall = false
        if Config.Voip == "tokovoip" then
            exports.tokovoip_script:removePlayerFromRadio(id)
        elseif Config.Voip == "mumble"  then
            exports["mumble-voip"]:SetCallChannel(0)
        elseif Config.Voip == "pma-voice" then
            exports["pma-voice"]:SetCallChannel(0)
        end
        HSN.InCallL = false
        HSN.PlaySound("close",0.05)
    elseif (type == "cancelcall") then
        HSN.CancelCall = true
        HSN.PlaySound("close",0.05)
        HSN.InCall = false
        PhonePlayText()
        Citizen.Wait(2000)
        HSN.CancelCall = false
    end
end)

RegisterNetEvent("hsn-phone-client-DeletePatientData")
AddEventHandler("hsn-phone-client-DeletePatientData", function(id)
    SendNUIMessage({message = "DeletePatientData", id = id})
end)

RegisterNetEvent('esx:onPlayerDeath')
AddEventHandler('esx:onPlayerDeath', function(data)
    HSN.PlayerIsDead = true
    TriggerEvent("hsn-phone-clinet:togglePhoneClose")
end)

RegisterNetEvent("hsn-phone-client:RemoveContact")
AddEventHandler("hsn-phone-client:RemoveContact",function(id)
    SendNUIMessage({message = "RemoveContact", id = id})
end)

-- RegisterCommand("testnotification",function()
--     TriggerEvent("hsn-phone-client:NewNotification",{message = "New tweet from Hasan !", icon = '<i class="fab fa-twitter"></i>', background = "rgb(12, 163, 218)", app = "Twitter"})
-- end)



RegisterNetEvent("hsn-phone-client:NewNotification")
AddEventHandler("hsn-phone-client:NewNotification",function(Notification)
    Notification.IsPhoneOpen = HSN.PhoneIsOpened
    SendNUIMessage({message = "OpenForNotification", data = Notification})
    if (Notification.type == "call-src") then
        RepeatCount = 0
        HSN.InCall = true
        PhonePlayCall()
        for i = 1, 10 + 1, 1 do
            if RepeatCount + 1 ~= 10 + 1 then
                print(HSN.InCallL, HSN.CancelCall)
                if HSN.InCallL or HSN.CancelCall then
                    break
                else
                    RepeatCount = RepeatCount + 1
                    HSN.PlaySound("demo", 0.2)
                    Citizen.Wait(2000)
                end
            else
                TriggerServerEvent("hsn-phone-server-answercall","decline")
                break
            end
        end
    end
end)

RegisterNetEvent("hsn-phone-client-addNewPhotoToGallery")
AddEventHandler("hsn-phone-client-addNewPhotoToGallery",function(photo, id)
    SendNUIMessage({message = "AddNewPhotoToGallert", photo = photo, id = id})
end)





RegisterNetEvent("hsn-phone-server-setupnewApp")
AddEventHandler("hsn-phone-server-setupnewApp",function(appname)
    SendNUIMessage({message = "setupnewap", newApp = appname})
end)

RegisterNetEvent("hsn-phone-client-DeleteBolo")
AddEventHandler("hsn-phone-client-DeleteBolo",function(id)
    SendNUIMessage({message = "DeleteBolo", boloid = id})
end)

RegisterNetEvent("hsn-phone-client-deleteApp")
AddEventHandler("hsn-phone-client-deleteApp",function(app)
    SendNUIMessage({message = "DeleteApp", app = app})
end)

RegisterNetEvent("hsn-phone-client-call")
AddEventHandler("hsn-phone-client-call",function(isOnline, reason)
    if isOnline then

    else
        SendNUIMessage({message = "declineCall", reason = reason})
    end
end)

RegisterNetEvent("hsn-phone-client-setPhoto")
AddEventHandler("hsn-phone-client-setPhoto",function(index, photo)
    local data = {}
    data.photoindex = index
    data.photo = photo
    SendNUIMessage({message = "SetPhoto", data = data})
end)


-- nui callbacks

RegisterNUICallback("downloadApp",function(data)
    TriggerServerEvent("hsn-phone-server-downloadApp",data.appname)
end)

RegisterNUICallback("getmessages",function(data, cb)
    ESX.TriggerServerCallback("hsn-phone-server-getmessagedata",function(messages)
        cb(messages)
    end)
end)


RegisterNUICallback("getLastCalls",function(data,cb)
    ESX.TriggerServerCallback("hsn-phone-server-getLastCalls",function(calls) 
        cb(calls)
    end)
end)

RegisterNUICallback("GetGalleryPhotos",function(data,cb)
    ESX.TriggerServerCallback("hsn-phone-server-getGalleryPhotos",function(photos) 
        cb(photos)
    end)
end)

RegisterNUICallback("DeleteBolo",function(data,cb)
    TriggerServerEvent("hsn-phone-server-DeleteBolo",data)
end)


RegisterNUICallback("GetAdds",function(data,cb)
    ESX.TriggerServerCallback("hsn-phone-server:GetAdds",function(photos) 
        cb(photos)
    end)
end)

RegisterNetEvent("hsn-phone-client:addNewAdd")
AddEventHandler("hsn-phone-client:addNewAdd",function(data)
    SendNUIMessage({message = "AddNewAdds", data = data})
end)

RegisterNUICallback("AddNewAdds",function(data)
    TriggerServerEvent("hsn-phone-server:AddNewAdvertisements",data)
end)

RegisterNUICallback("DeleteAdds",function(data)
    TriggerServerEvent("hsn-phone-server:DeleteAdvertisement",data.id)
end)

RegisterNUICallback("EditAdd",function(data)
    TriggerServerEvent("hsn-phone-server:EditAdvertisement",data.id, data.newtext)
end)

RegisterNetEvent("hsn-phone-client:deleteadd")
AddEventHandler("hsn-phone-client:deleteadd",function(id)
    SendNUIMessage({message = "DeleteAdd", id = id})
end)

RegisterNetEvent("hsn-phone-server:EditAdvertisement")
AddEventHandler("hsn-phone-server:EditAdvertisement",function(id , newtext)
    SendNUIMessage({message = "EditAdd", id = id, newtext = newtext})
end)

RegisterNUICallback("call",function(data,cb)
    TriggerServerEvent("hsn-phone-server-call",data.phonenumber, HSN.EnableAnonymousCall)
end)

RegisterNUICallback("SetLocation",function(data,cb)
    if (data.x and data.y) then
        data.x = tonumber(data.x)
        data.y = tonumber(data.y)
        SetNewWaypoint(data.x, data.y)
        ESX.ShowNotification("Waypoint set!")
    end
end)



RegisterNetEvent("hsn-phone-client-updatemessages")
AddEventHandler("hsn-phone-client-updatemessages",function(newData, allData, number)
    print(newData.sender)
    SendNUIMessage({message = "UpdateMessages", newData = newData, allData = allData, number = number })
end)


RegisterNUICallback("AnswerCall",function(data,cb)
    TriggerServerEvent("hsn-phone-server-answercall",data.type)
end)

RegisterNUICallback("SendMoney",function(data)
    TriggerServerEvent("hsn-phone-server-sendMoney",data)
end)

RegisterNetEvent("hsn-phone-client-sendMoney")
AddEventHandler("hsn-phone-client-sendMoney",function(data)
    SendNUIMessage({message = "SendMoney", returndata = data})
end)

RegisterNetEvent("hsn-phone-client-UpdateBankBalance")
AddEventHandler("hsn-phone-client-UpdateBankBalance",function(balance)
    SendNUIMessage({message = "UpdateBankBalance", amount = balance})
end)




RegisterNUICallback("getTweets",function(data,callb)
    ESX.TriggerServerCallback("hsn-phone-server-getTweets",function(test)
        callb(test)
    end)
end)


RegisterNUICallback("getMails",function(data,callb)
    ESX.TriggerServerCallback("hsn-phone-server-getMails",function(mails)
        callb(mails)
    end)
end)

RegisterNUICallback("AmbulanceDeletePatient",function(data)
    TriggerServerEvent("hsn-phone-server-DeletePatientData",data)
end)


RegisterNetEvent("hsn-phone-client-addNewMail")
AddEventHandler("hsn-phone-client-addNewMail",function(data)
    if (data.app and data.message) then
        SendNUIMessage({message = "AddNewMail", mailData = data})
    end
end)

RegisterNetEvent("hsn-phone-client-addNewMailToPage")
AddEventHandler("hsn-phone-client-addNewMailToPage",function(data)
    SendNUIMessage({message = "AddNewMailToPage", mailData = data})
end)

RegisterNetEvent("hsn-phone-client-deletemail")
AddEventHandler("hsn-phone-client-deletemail",function(id)
    SendNUIMessage({message = "DeleteMail", mailId = id})
end)






RegisterNUICallback("deleteApp",function(data)
    TriggerServerEvent("hsn-phone-server-deleteApp",data.appname)
end)

RegisterNUICallback("GetActiveJob",function(data,cb)
    ESX.TriggerServerCallback("hsn-phone-server-GetActiveJob",function(result)
        cb(result)
    end,data.job)
end)


RegisterNUICallback("getPlayerCars",function(data,cb)
    ESX.TriggerServerCallback("hsn-phone-server-getPlayerCars",function(result)
        for k,v in pairs(result) do
            local vehicle = json.decode(v.vehicle)
            v.vehicle = json.decode(v.vehicle)
            if vehicle.model then
                v.vehicleClass = GetVehicleClassFromName(v.vehicle.model)
                v.IsCarAllowedForRemote = HSN.IsCarAllowedForRemote(v.vehicleClass)
                if GetLabelText(GetDisplayNameFromVehicleModel(vehicle.model)) == "NULL" then
                    v.vehLabel = "Unkown"
                else
                    v.vehLabel = GetLabelText(GetDisplayNameFromVehicleModel(vehicle.model))
                end
            end
        end
        cb(result)
    end)
end)


-- RegisterCommand("onlytest",function()
--     SendNUIMessage({message = "onlytest"})
-- end)




RegisterNUICallback("ToggleValet",function(data)
    local playerPed = PlayerPedId()
    local coords    = GetOffsetFromEntityInWorldCoords(PlayerPedId(), 1.5, 6.0, 2.0)
    local heading = GetEntityHeading(playerPed)
    local vehicles = ESX.Game.GetVehicles()

    for k,v in pairs(vehicles) do
        local vehicle = v

        if DoesEntityExist(vehicle) then
            if ESX.Math.Trim(GetVehicleNumberPlateText(vehicle)) == ESX.Math.Trim(data.car.plate) then
                ESX.ShowNotification("This car already exist marked on gps!")
                local vCoords = GetEntityCoords(vehicle)
                SetNewWaypoint(vCoords.x,vCoords.y)
                return
            end
        end
    end
    ESX.Game.SpawnVehicle(data.car.vehicle.model, vector3(coords.x,coords.y,coords.z), heading, function(callback_vehicle)
        SetEntityAsMissionEntity(callback_vehicle, true, true)
        ClearAreaOfVehicles(GetEntityCoords(callback_vehicle), 5000, false, false, false, false, false);  
        SetVehicleOnGroundProperly(callback_vehicle)
        ESX.Game.SetVehicleProperties(callback_vehicle, data.car.vehicle)
        TriggerServerEvent("hsn-phone-server-SetCarOut",data.car.plate)
        -- Set Your Hotwire Trigger
        --exports["hsn-hotwire"]:AddKeys(data.car.plate)
    end)  
end)




RegisterNUICallback("GetContacts",function(data,cb)
    ESX.TriggerServerCallback("hsn-phone-server-getContacts",function(result)
        cb(result)
    end)
end)



RegisterNUICallback("DeleteMail",function(data)
    TriggerServerEvent("hsn-phone-server-deletemail",data.id)
end)


RegisterNUICallback("GetMail",function(data,cb)
    ESX.TriggerServerCallback("hsn-phone-server-getMail",function(result)
        cb(result)
    end,data.id)
end)

RegisterNUICallback("DeleteContact",function(data,cb)
    TriggerServerEvent("hsn-phone-server-DeleteContact",data.contactid)
end)


RegisterNUICallback("AddNewMail",function(data)
    --TriggerServerEvent("hsn-phone-server-deletelastcall",data.id)
    TriggerServerEvent("hsn-phone-server-addNewMail",data)
end)


RegisterNUICallback("deletelastcall",function(data)
    TriggerServerEvent("hsn-phone-server-deletelastcall",data.id)
end)


RegisterNetEvent("hsn-phone-client-downloadApp")
AddEventHandler("hsn-phone-client-downloadApp",function(app, remainingtime)
    SendNUIMessage({message = "Download", app = app, time = remainingtime})
end)

RegisterNetEvent("hsn-phone-client-updateCryptoChanges")
AddEventHandler("hsn-phone-client-updateCryptoChanges",function(changes)
    SendNUIMessage({message = "UpdateCryptoChanges", changes = changes})
end)



RegisterNUICallback("IsUserNameTaken",function(data,cb)
    ESX.TriggerServerCallback("hsn-phone-server-IsUserNameTaken",function(result)
        cb(result)
    end,data.username)
end)

RegisterNUICallback("AccountCheck",function(data,cb)
    ESX.TriggerServerCallback("hsn-phone-server-TwitterAccountCheck",function(result)
        cb(result)
    end,data)
end)

RegisterNUICallback("SendNewTweet",function(data)
    TriggerServerEvent("hsn-phone-server-SendNewTweet",data.index)
 end)

RegisterNUICallback("TransferCrypto",function(data)
    TriggerServerEvent("hsn-phone-server-TransferCrypto",data.crypto, data.amount, data.targetId)
end)

RegisterNUICallback("SetAnonymousCall",function(data)
    HSN.EnableAnonymousCall = not HSN.EnableAnonymousCall
    SendNUIMessage({message = "UpdateAnonymousCall", EnableAnonymousCall = HSN.EnableAnonymousCall})
end)

RegisterNUICallback("getPlayerGPSCoord",function(data, cb)
    local coord = json.encode(GetEntityCoords(PlayerPedId()))
    cb(coord)
end)

RegisterNUICallback("sendmessage",function(data)
    TriggerServerEvent("hsn-phone-server-SendMessage",data)
end)


RegisterNetEvent("hsn-phone-client-SendNewTweet")
AddEventHandler("hsn-phone-client-SendNewTweet",function(data)
    SendNUIMessage({message = "SendNewTweet", index = data})
end)

RegisterNetEvent("hsn-phone-client-refresh-twitterlikes")
AddEventHandler("hsn-phone-client-refresh-twitterlikes",function(tweetid,likes)
    SendNUIMessage({message = "RefreshTwitterLikes",tweetid = tweetid, likes = likes})
end)

RegisterNetEvent("hsn-phone-client-UpdateMyCryptos")
AddEventHandler("hsn-phone-client-UpdateMyCryptos",function(crypto, value)
    SendNUIMessage({message = "UpdateCryptoValue",crypto = crypto, value = value})
end)

RegisterNetEvent("hsn-phone-client-PhoneShowNotification")
AddEventHandler("hsn-phone-client-PhoneShowNotification",function(reason, type)
    SendNUIMessage({message = "PhoneShowNotification",reason = reason, type = type})
end)



RegisterNUICallback("registerTwitter",function(data)
    TriggerServerEvent("hsn-phone-server-registerTwitter-confirm",data.twData)
end)

RegisterNUICallback("logOutTwitter",function()
    TriggerServerEvent("hsn-phone-server-twitter-logOut")
end)

RegisterNUICallback("ChangePhoto",function(data)
    TriggerServerEvent("hsn-phone-server-changePhoto",data.photoindex,data.photo)
end)

RegisterNUICallback("getPlayerFromPhoneNumber",function(data,cb)
    ESX.TriggerServerCallback("hsn-phone-server-getPlayerFromPhoneNumber",function(result)
        cb(result)
    end,data.phonenumber)
end)


RegisterNUICallback("close",function()
    SetNuiFocus(false,false)
    HSN.PhoneIsOpened = false
    if not HSN.InCall then
        PhonePlayOut()
    end
end)

RegisterNetEvent("hsn-phone-clinet:togglePhoneClose")
AddEventHandler("hsn-phone-clinet:togglePhoneClose",function()
    if HSN.PhoneIsOpened then
        SetNuiFocus(false,false)
        HSN.PhoneIsOpened = false
        PhonePlayOut()
        SendNUIMessage({message = "Close"})
    end
end)

HSN.ClosePhone = function()
    if HSN.PhoneIsOpened then
        SetNuiFocus(false,false)
        HSN.PhoneIsOpened = false
        if not HSN.InCall then
            PhonePlayOut()
        end
        SendNUIMessage({message = "Close"})
    end
end



RegisterNUICallback("AddNewNote",function(data)
    TriggerServerEvent("hsn-phone-server-addNewNote",data.noteData)
end)

RegisterNUICallback("addPhotoToGallery",function(data)
    TriggerServerEvent("hsn-phone-server-addPhotoToGallery",data.photo)
end)

RegisterNUICallback("DeletePhotoFromGallery",function(data)
    TriggerServerEvent("hsn-phone-server-DeletePhotoFromGallery",data.id)
end)

RegisterNetEvent("hsn-phone-client-DeletePhotoFromGallery")
AddEventHandler("hsn-phone-client-DeletePhotoFromGallery",function(photoid)
    SendNUIMessage({message = "DeletePhotoFromGallery", id = photoid})
end)

RegisterNUICallback("editnote",function(data)
    TriggerServerEvent("hsn-phone-server-editnote",data.noteid, data.noteData)
end)

RegisterNUICallback("getBills",function(data, cb)
    ESX.TriggerServerCallback("esx_billing:getBills",function(bills)
        cb(bills)
    end)
end)

RegisterCommand("test",function()
    local coord = GetEntityCoords(PlayerPedId())
end)

RegisterNUICallback("PayBill",function(data, cb)
    ESX.TriggerServerCallback("esx_billing:payBill",function(bills)
        if bills == nil then
            SendNUIMessage({message = "DeleteBill", id = data.id})
        end
    end, tonumber(data.id))
end)

RegisterNUICallback("PayAllBils",function(data, cb)
    ESX.TriggerServerCallback("esx_billing:getBills",function(bills)
        for k,v in pairs(bills) do
            ESX.TriggerServerCallback("esx_billing:payBill",function(bills)
                if bills == nil then
                    SendNUIMessage({message = "DeleteBill", id = v.id})
                end
            end, tonumber(v.id))
        end
    end)
end)



RegisterCommand("testbill",function()
    TriggerServerEvent('esx_billing:sendBill', GetPlayerServerId(PlayerId()), 'society_police', 'Bıçaklı Saldırı', 4500)
end)

RegisterNUICallback("getNotes",function(_________,cb)
    ESX.TriggerServerCallback("hsn-phone-server-getNotes",function(result)
        cb(result)
    end)
end)

RegisterNUICallback("AmbulanceCreateNewPatientData",function(data)
    TriggerServerEvent("hsn-phone-server-CreateNewPatientData",data)
end)




RegisterNUICallback("addnewContact",function(data)
    TriggerServerEvent("hsn-phone-server-addnewContact",data.contactData)
end)

RegisterNUICallback("addnewbolo",function(data)
    TriggerServerEvent("hsn-phone-server-addnewbolo",data)
end)

RegisterNUICallback("getPatients",function(data,cb)
    ESX.TriggerServerCallback("hsn-phone-server-GetPatientDatas",function(result)
        cb(result)
    end)
end)

RegisterNUICallback("SearchCitizen",function(data,cb)
    ESX.TriggerServerCallback("hsn-phone-server-SearchCitizen",function(result)
        cb(result)
    end, data.data)
end)


RegisterNUICallback("SearchVehicle",function(data,cb)
    ESX.TriggerServerCallback("hsn-phone-server-SearchVehicle",function(result)
        for k,v in pairs(result) do
            if v.vehicledata ~= nil then 
                if GetLabelText(GetDisplayNameFromVehicleModel(v.vehicledata.model)) == "NULL" then
                    v.vehLabel = "Unkown"
                else
                    v.vehLabel = GetLabelText(GetDisplayNameFromVehicleModel(v.vehicledata.model))
                end
            end
        end
        cb(result)
    end, data.plate)
end)




RegisterNetEvent("hsn-phone-client-addNewNote")
AddEventHandler("hsn-phone-client-addNewNote",function(data)
    SendNUIMessage({message = "AddNewNote",data = data})
end)



RegisterNetEvent("hsn-phone-client-deleteNote")
AddEventHandler("hsn-phone-client-deleteNote",function(noteid)
    SendNUIMessage({message = "DeleteNote",noteid = noteid})
end)

RegisterNetEvent("hsn-phone-client-addnewcontact")
AddEventHandler("hsn-phone-client-addnewcontact",function(data)
    SendNUIMessage({message = "AddNewContact",data = data})
end)

RegisterNUICallback("getNote",function(data,cb)
    ESX.TriggerServerCallback("hsn-phone-server-getNote",function(result)
        cb(result)
    end,data.noteid)
end)

RegisterNUICallback("GetTransactions",function(data,cb)
    ESX.TriggerServerCallback("hsn-phone-server-GetCryptoTransactions",function(result)
        cb(result)
    end)
end)


RegisterNUICallback("deleteNote",function(data)
    TriggerServerEvent("hsn-phone-server-deletenote",data.noteid)
end)




RegisterNUICallback("LikeTweet",function(data)
    TriggerServerEvent("hsn-phone-server-togglelike",data.tweetid)
end)


RegisterNUICallback("DeleteTwitterAccount",function()
    TriggerServerEvent("hsn-phone-server-twitter-DeleteTwitterAccount")
end)

RegisterNUICallback("BuyOrSellCryptoCurrency",function(data)
    TriggerServerEvent("hsn-phone-server-BuyCryptoCurrency",data.type, data.amount, data.crypto)
end)



RegisterCommand("ikisde",function()
    local data= {}
    data[1] =  "a"
    data[2] = 3
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


HSN.IsCarAllowedForRemote = function(class)
    if class == 5 or class == 6 or class == 7 then -- sport and super cars
        return true
    end
    return false
end



AddEventHandler('onResourceStop', function(resourceName)
    if GetCurrentResourceName() == resourceName then
        SetNuiFocus(false, false)
    end
end)



-- Animations

local myPedId = nil

local phoneProp = 0
local phoneModel = "prop_npc_phone_02"



local currentStatus = 'out'
local lastDict = nil
local lastAnim = nil
local lastIsFreeze = false

local ANIMS = {
	['cellphone@'] = {
		['out'] = {
			['text'] = 'cellphone_text_in',
			['call'] = 'cellphone_call_listen_base',
		},
		['text'] = {
			['out'] = 'cellphone_text_out',
			['text'] = 'cellphone_text_in',
			['call'] = 'cellphone_text_to_call',
		},
		['call'] = {
			['out'] = 'cellphone_call_out',
			['text'] = 'cellphone_call_to_text',
			['call'] = 'cellphone_text_to_call',
		}
	},
	['anim@cellphone@in_car@ps'] = {
		['out'] = {
			['text'] = 'cellphone_text_in',
			['call'] = 'cellphone_call_in',
		},
		['text'] = {
			['out'] = 'cellphone_text_out',
			['text'] = 'cellphone_text_in',
			['call'] = 'cellphone_text_to_call',
		},
		['call'] = {
			['out'] = 'cellphone_horizontal_exit',
			['text'] = 'cellphone_call_to_text',
			['call'] = 'cellphone_text_to_call',
		}
	}
}

function newPhoneProp(myPedId)
	deletePhone()
	RequestModel(phoneModel)
	while not HasModelLoaded(phoneModel) do
		Citizen.Wait(500)
	end
	phoneProp = CreateObject(GetHashKey(phoneModel), 1.0, 1.0, 1.0, 1, 1, 0)

	local bone = GetPedBoneIndex(myPedId, 28422)
	AttachEntityToEntity(phoneProp, myPedId, bone, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 1, 1, 0, 0, 2, 1)

end

function deletePhone ()
	if phoneProp ~= 0 then
		Citizen.InvokeNative(0xAE3CBE5BF394C9C9 , Citizen.PointerValueIntInitialized(phoneProp))
		phoneProp = 0
	end
end

function changePhoneType(type)
	
end

--[[
	out || text || Call ||
--]]
function PhonePlayAnim (status, freeze, force)
	if currentStatus == status and force ~= true then
		return
	end

	myPedId = PlayerPedId()

	GiveWeaponToPed(myPedId, 0xA2719263, 0, 0, 1)
	
	local freeze = freeze or false

	local dict = "cellphone@"
	if IsPedInAnyVehicle(myPedId, false) then
		dict = "anim@cellphone@in_car@ps"
	end
	loadAnimDict(dict)

	local anim = ANIMS[dict][currentStatus][status]
	if currentStatus ~= 'out' then
		StopAnimTask(myPedId, lastDict, lastAnim, 1.0)
	end
	local flag = 50
	if freeze == true then
		flag = 14
	end
	TaskPlayAnim(myPedId, dict, anim, 3.0, -1, -1, flag, 0, false, false, false)

	if status ~= 'out' and currentStatus == 'out' then
		Citizen.Wait(380)
		newPhoneProp(myPedId)
	end

	lastDict = dict
	lastAnim = anim
	lastIsFreeze = freeze
	currentStatus = status

	if status == 'out' then
		Citizen.Wait(180)
		deletePhone()
		StopAnimTask(myPedId, lastDict, lastAnim, 1.0)
	end
end

function PhonePlayOut ()
	PhonePlayAnim('out')
end

function PhonePlayText ()
	PhonePlayAnim('text')
end

function PhonePlayCall (freeze)
	PhonePlayAnim('call', freeze)
end

function PhonePlayIn () 
	if currentStatus == 'out' then
		PhonePlayText()
	end
end

function loadAnimDict(dict)
	RequestAnimDict(dict)
	while not HasAnimDictLoaded(dict) do
		Citizen.Wait(1)
	end
end


phone = false
phoneId = 0

RegisterNetEvent('camera:open')
AddEventHandler('camera:open', function()
    CreateMobilePhone(0)
	CellCamActivate(true, true)
	phone = true
    PhonePlayOut()
end)

frontCam = false

function CellFrontCamActivate(activate)
	return Citizen.InvokeNative(0x2491A93618B7D838, activate)
end

Citizen.CreateThread(function()
	DestroyMobilePhone()
	while true do
		Citizen.Wait(0)
				
		if IsControlJustPressed(1, 177) and phone == true then -- CLOSE PHONE
			DestroyMobilePhone()
			phone = false
			CellCamActivate(false, false)
			if firstTime == true then 
				firstTime = false 
				Citizen.Wait(2500)
				displayDoneMission = true
			end
		end
		
		if IsControlJustPressed(1, 27) and phone == true then -- SELFIE MODE
			frontCam = not frontCam
			Citizen.InvokeNative(0x2491A93618B7D838, frontCam)
		end
			
		if phone == true then
			HideHudComponentThisFrame(7)
			HideHudComponentThisFrame(8)
			HideHudComponentThisFrame(9)
			HideHudComponentThisFrame(6)
			HideHudComponentThisFrame(19)
			HideHudAndRadarThisFrame()
		end
			
		ren = GetMobilePhoneRenderId()
		SetTextRenderId(ren)
		
		-- Everything rendered inside here will appear on your phone.
		
		SetTextRenderId(1) -- NOTE: 1 is default
	end
end)



RegisterNUICallback("takePhoto",function(___, cb)
    if HSN.PhoneIsOpened then
        SetNuiFocus(false,false)
    end
    CreateMobilePhone(1)
    CellCamActivate(true, true)
    takePhoto = true
    Citizen.Wait(0)
    if hasFocus == true then
      SetNuiFocus(false, false)
      hasFocus = false
    end
    Citizen.CreateThread(function()
        while takePhoto do
            Citizen.Wait(0)
              if IsControlJustPressed(1, 27) then -- Toogle Mode
                  frontCam = not frontCam
                  CellFrontCamActivate(frontCam)
              elseif IsControlJustPressed(1, 177) then -- CANCEL
                  DestroyMobilePhone()
                  CellCamActivate(false, false)
                  cb("nil")
                  takePhoto = false
                  SetNuiFocus(true,true)
                  PhonePlayAnim('text', false, true)
              break
            elseif IsControlJustPressed(1, 176) then -- TAKE.. PIC
                exports['screenshot-basic']:requestScreenshotUpload("https://discord.com/api/webhooks/851717364915634176/K1Ck2q2gLibjF0C2KpT2Og3_QiM7ciMGUk_Ly1tCQS4sGaw_SeJZ1pqewlpZnyCfGm5v", "files[]", function(data)
                    local resp = json.decode(data)
                    DestroyMobilePhone()
                    CellCamActivate(false, false)
                    cb(resp.attachments[1].proxy_url)  
                    takePhoto = false
                    SetNuiFocus(true,true)
                    PhonePlayAnim('text', false, true)
                    --local message = "Photo saved! "
                    --TriggerEvent("hsn-phone-client:NewNotification",{type = "message",message = message, icon = '<i class="fas fa-camera"></i>', background = "#386641", app = "Camera", duration = 3000})
                end)
            end
            HideHudComponentThisFrame(7)
            HideHudComponentThisFrame(8)
            HideHudComponentThisFrame(9)
            HideHudComponentThisFrame(6)
            HideHudComponentThisFrame(19)
            HideHudAndRadarThisFrame()
          end
    end)
    Citizen.Wait(1000)
end)


RegisterNetEvent("esx_ambulancejob:revive")
AddEventHandler("esx_ambulancejob:revive",function()
    HSN.PlayerIsDead = false
end)

AddEventHandler('disc-death:onPlayerRevive', function(data)
	HSN.PlayerIsDead = false
end)


HSN.PlaySound = function(soundname, soundvolume)
    SendNUIMessage({message = "PlaySound", soundname = soundname, soundvolume = soundvolume})
end

RegisterCommand("a", function()
    TriggerServerEvent("hsn-phone-server-answercall","accept")
end)

RegisterCommand("h",function()
    TriggerServerEvent("hsn-phone-server-answercall","decline")
end)

Citizen.CreateThread(function()
	TriggerEvent('chat:addSuggestion', '/a', 'Answer Phone Call', {})
	TriggerEvent('chat:addSuggestion', '/h', 'Reject Phone Call', {})
end)