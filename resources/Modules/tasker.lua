local Module = {}
Module.ClassName = "Tasker"

function Module.new()
    local Referer = {}
    Referer.Tasks = {}

    -- Identify the module class name       { }

    function Referer.ClassName()
        return Module.ClassName
    end

    -- Make a new task           { @Name: string, @Signal : ... }

    function Referer:MakeTask(Name, Signal)
        if not self.Tasks[Name] then
            if typeof(Signal) == "RBXScriptConnection" or typeof(Signal) == "function" then
                self.Tasks[Name] = Signal
            else
                error("The signal is not a RBXScriptConnection or a function, expected: " .. typeof(Signal) .. ".")
            end
        else
            error("Task `" .. Name .. "` is already exist.")
        end
    end

    -- Fire the existing task           { @Name: string, @... }

    function Referer:FireTaskSignal(Name, ...)
        if self.Tasks[Name] then
            if typeof(self.Tasks[Name]) == "RBXScriptConnection" then
                self.Tasks[Name]:Fire(...)
            elseif typeof(self.Tasks[Name]) == "function" then
                self.Tasks[Name](...)
            else
                error("The signal is not a RBXScriptConnection or a function, expected: " .. typeof(self.Tasks[Name]) .. ".")
            end
        else
            error("Task `" .. Name .. "` does not exist.")
        end
    end

    -- Fire all existing task           { @... }

    function Referer:FireAllTaskSignal(...)
        for _, Child in pairs(self.Tasks) do
            if typeof(Child) == "RBXScriptConnection" then
                Child:Fire(...)
            elseif typeof(Child) == "function" then
                Child(...)
            else
                error("The signal is not a RBXScriptConnection or a function, expected: " .. typeof(Child) .. ".")
            end
        end
    end

    -- Destroy the existing task                { @Name: string }

    function Referer:DestroyTask(Name)
        if self.Tasks[Name] then
            if typeof(self.Tasks[Name]) == "RBXScriptConnection" then
                self.Tasks[Name]:Disconnect()
                self.Tasks[Name] = nil
            elseif typeof(self.Tasks[Name]) == "function" then
                self.Tasks[Name] = nil
            else
                error("The signal is not a RBXScriptConnection or a function, expected: " .. typeof(self.Tasks[Name]) .. ".")
            end
        else
            error("Task `" .. Name .. "` does not exist.")
        end
    end

    -- Destroy all existing task                { }

    function Referer:DestroyAllTask()
        for _, Child in pairs(self.Tasks) do
            if typeof(Child) == "RBXScriptConnection" then
                Child:Disconnect()
                self.Tasks[_] = nil
            elseif typeof(Child) == "function" then
                self.Tasks[_] = nil
            else
                error("The signal is not a RBXScriptConnection or a function, expected: " .. typeof(Child) .. ".")
            end
        end
    end

    return Referer
end

return Module