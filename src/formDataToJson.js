export default function formDataToJson(form) {
    var obj = {};
    var elements = form.querySelectorAll('input');

    for (var i = 0; i < elements.length; ++i) {
        var element = elements[i];
        var name = element.name.replace('edz-', '');
        var value = element.value;

        if (name) {
            obj[name] = value;
        }
    }

    return JSON.parse(JSON.stringify(obj));
}
