const action = {}

export default {
    dispatch: function (eventType) {
        document.dispatchEvent(action[eventType]);
    },

    add: function (eventType, fn) {
        const event = document.createEvent('Event');
        event.initEvent(eventType, true, true);
        action[eventType] = event;
        document.addEventListener(eventType, fn, false);
    }
}