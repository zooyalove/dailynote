const util = (() => {
    function empty(str) {
        return (str.length ===0 || !str.trim());
    }

    return {
        empty: empty,
        isset: (str) => !empty(str)
    };
})();

export default util;