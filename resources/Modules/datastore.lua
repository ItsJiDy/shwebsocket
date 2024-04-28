local Module = {}
Module.ClassName = "Data Store"

function Module:SetStore(Folder, Value)
    local Response = self.MakeAwaitFunction(
        function()
            self.Render()
            return self.MakeRequest(
                self.BaseUrl,
                "/v1/script/",
                {
                    folder = Folder,
                    value = Value
                }
            )
        end
    )
    if Response then
        return Response.success
    end
end

function Module:Init(...)
    local Args = { ... }
    for _, Object in pairs(Args) do
        self[_] = Object
    end
end

return Module