function scanTag(elem, vmodels, node) {
    //扫描顺序  ms-skip(0) --> ms-important(1) --> ms-controller(2) --> ms-if(10) --> ms-repeat(100) 
    //--> ms-if-loop(110) --> ms-attr(970) ...--> ms-each(1400)-->ms-with(1500)--〉ms-duplex(2000)垫后
    var a = elem.getAttribute("ms-skip")
    //#360 在旧式IE中 Object标签在引入Flash等资源时,可能出现没有getAttributeNode,innerHTML的情形
    if (!elem.getAttributeNode) {
        return log("warning " + elem.tagName + " no getAttributeNode method")
    }
    var b = elem.getAttributeNode("ms-important")
    var c = elem.getAttributeNode("ms-controller")
    if (typeof a === "string") {
        return
    } else if (node = b || c) {
        var newVmodel = avalon.vmodels[node.value]
        if (!newVmodel) {
            return
        }
        //ms-important不包含父VM，ms-controller相反
        var cb = vmodels.cb
        vmodels = node === b ? [newVmodel] : [newVmodel].concat(vmodels)
        vmodels.cb = cb
        var name = node.name
        elem.removeAttribute(name) //removeAttributeNode不会刷新[ms-controller]样式规则
        avalon(elem).removeClass(name)
        createSignalTower(elem, newVmodel)
    }
    scanAttr(elem, vmodels) //扫描特性节点
}