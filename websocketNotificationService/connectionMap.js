const connections = new Map();

module.exports = {
    addToGroup: ({userId, ws, wsId}) => {
        const group = connections.get(userId);
        if (group) {
            group.set(wsId, ws);
            return;
        }
        const newGroup = new Map();
        newGroup.set(wsId, ws);
        connections.set(userId, newGroup);
        newGroup.keys()
    },
    deleteByElementId: ({groupId, wsId}) => {
        const group = connections.get(groupId);
        if (!group) return;
        group.delete(wsId);
        if (!group.keys().length) connections.delete(groupId);
    },
    getElementsByUserId: ({userId}) => {
        const values = connections.get(userId)?.values();
        if (!values) return [];
        return [...values];
    }
};