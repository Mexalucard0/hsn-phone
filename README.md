# hsn-phone
hsn-phone for fivem

# ghattimysql export
Add to ghmattimysql-server.lua
```
exports("ready", function (callback)
  Citizen.CreateThread(function ()
      -- add some more error handling
      while GetResourceState('ghmattimysql') ~= 'started' do
          Citizen.Wait(0)
      end
      -- while not exports['mysql-async']:is_ready() do
      --     Citizen.Wait(0)
      -- end
      callback()
  end)
end)
```
https://hasan.tebex.io/package/4658624

https://discord.gg/6FQhKDXBJ6
