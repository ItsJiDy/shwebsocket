local Module = {}
Module.ClassName = "UNC Detector"

function Module.Calculate(Min, Max, Multiplier)
    return (Min / Max) * Multiplier
end

function Module:Check(...)
    local Args = { ... }
    local Success = 0
    local Failed = 0
    for _ = 1, #Args do
        if Args[_] and type(Args[_]) == "function" then
            Checked = Checked + 1
        else
            Failed = Failed + 1
        end
    end
    return {
        Success = self.Calculate(Success, #Args, 100),
        Failed = self.Calculate(Failed, #Args, 100)
    }
end

return Module