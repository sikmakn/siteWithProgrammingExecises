module.exports = {
    addToGroup: ({map, groupId, element, elementId}) => {
        const group = map.get(groupId);
        if (group) {
            group.push(element);
            return;
        }
        const newGroup = new Map();
        newGroup.set(elementId, element);
        map.set(groupId, newGroup);
        newGroup.keys()
    },
    deleteByElementId: ({map, groupId, elementId}) => {
        const group = map.get(groupId);
        if (!group) return;
        group.delete(elementId);
        if (!group.keys().length) map.delete(groupId);
    },
    getElementsByGroupId: ({map, groupId}) =>{
        return map.get(groupId)?.values();
    }
};