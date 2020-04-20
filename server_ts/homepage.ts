const fs = require('fs');
const path = require('path');

const root = path.dirname(__dirname)

export class Homepage {
    homepage_path: string;
    homepage_template_path: string;
    googlemaps_key_path: string;

    constructor() {
        this.homepage_template_path = path.join(root, "html_templates", "index.html");
        this.homepage_path = path.join(root, "client", "index.html");
        this.googlemaps_key_path = path.join(root, "secrets", "GOOGLEMAPS_KEY");
    }

    insertGoogleMapsKey(): void {
        var contents = fs.readFileSync(this.homepage_template_path, 'utf8').trim();
        var googlemaps_key = fs.readFileSync(this.googlemaps_key_path, 'utf8').trim();
        contents = contents.replace("GOOGLEMAPS_KEY", googlemaps_key);
        fs.writeFileSync(this.homepage_path, contents);
    }
}