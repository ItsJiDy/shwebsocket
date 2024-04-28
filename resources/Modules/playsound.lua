local Module = {}
Module.ClassName = "PlaySound"

function Module:PlaySound(Object, File)
    self.OpenFile(self, File)
    Object:Play(0, self.Read(self), {})
end

return Module