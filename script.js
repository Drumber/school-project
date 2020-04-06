jQuery(document).ready(function ($) {

    // dark theme storage
    if(typeof(Storage) !== "undefined" && localStorage != null) {
        if(localStorage.getItem("theme") == "dark") {
            document.documentElement.setAttribute('data-theme', 'dark');
        }
    }

    // navbar transparent if scrolled up
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.navigationbar').addClass('scrolled');
        } else {
            $('.navigationbar').removeClass('scrolled');
        }
    });

    // navbar mobile toggle
    $("#navtoggle").click(function() {
        $(".navigationbar ul").toggleClass("closed");
    });

    // scroll to top button
    var prevScrollpos = window.pageYOffset; // previous scroll position (for hiding botton on scroll)
    $(window).scroll(function() {
        if($(this).scrollTop() > 400) {
            setScrollUpVisible(true);
        } else {
            setScrollUpVisible(false);
        }
        // hide button on scroll
        if($(window).width() < 800) { // only hide button on scroll on smaller screens
            if(prevScrollpos > window.pageYOffset && $(this).scrollTop() > 400) {
                setScrollUpVisible(true);
            } else {
                setScrollUpVisible(false);
            }
        }
        prevScrollpos = window.pageYOffset;
    })

    // Deutschland Infizierte table
    // data from https://app.23degrees.io/embed/QFsdV7eaZFRHS0TP-choro-coronavirus-infektionen-in
    $.getJSON("https://app.23degrees.io/services/publicdata/5e89c84d505376001d1ee204").done(function (json) {
        var bundeslaender = json.data;
        var table = document.getElementById('deutschland').getElementsByTagName('tbody')[0];  // table reference
        var gesamtData;

        $.each(bundeslaender, function() {
            var row = table.insertRow();        // table row
            var bundlName = row.insertCell(0);  // table cell Bundesland
            var number = row.insertCell(1);     // table cell Infizierte
            var deaths = row.insertCell(2);     // table cell Tode
            // add text to cells
            bundlName.appendChild(document.createTextNode(this.a0));
            number.appendChild(document.createTextNode(format(this.a1)));
            deaths.appendChild(document.createTextNode(format(this.a2)));

            // add attributes for table sorting
            number.setAttribute('data-sort-value', this.a1);
            deaths.setAttribute('data-sort-value', this.a2);
            gesamtData = this;
        });

        // Stand and Gesamt text
        var standElement = document.getElementById('deutschland-stand');
        var standText = standElement.innerHTML;
        var newText = standText.replace("%gesamt", format(gesamtData.a5));    // replace variable with data
        standElement.innerHTML = newText.replace("%stand", gesamtData.a7);

        // make table sortable
        $('#deutschland').tablesort();
        $('#deutschland').tablesort().data('tablesort').sort($("th.default-sort"), 'desc');
    });


    // Welt Infizierte table
    // data from https://github.com/mathdroid/covid-19-api
    // Stand and Insgesamt
    $.getJSON("https://covid19.mathdro.id/api").done(function (json) {
        // Stand, Bestätigte, Gesunde und Tode text
        var standElement = document.getElementById('welt-stand');
        var standText = standElement.innerHTML;
        var date = new Date(json.lastUpdate);
        var dateText = new Intl.DateTimeFormat('de', { year: 'numeric', month: '2-digit', day: 'numeric', hour: 'numeric', minute: 'numeric' }).format(date);
        var newText = standText.replace("%stand", dateText);
        newText = newText.replace("%bestaetigt", format(json.confirmed.value));
        newText = newText.replace("%gesund", format(json.recovered.value));
        newText = newText.replace("%todesfaelle", format(json.deaths.value));
        standElement.innerHTML = newText;
    });

    // per country
    $.getJSON("https://covid19.mathdro.id/api/countries").done(function (jsonCountry) {
        var table = document.getElementById('welt').getElementsByTagName('tbody')[0];  // table reference
        var countries = jsonCountry.countries;

        $.each(countries, function() {
            var country = this.name;
            
            // get json data of country
            $.getJSON("https://covid19.mathdro.id/api/countries/" + country).done(function (json) {
                var row = table.insertRow();        // table row
                var countryName = row.insertCell(0);    // table cell Land
                var confirmed = row.insertCell(1);  // table cell Bestätigt
                var deaths = row.insertCell(2);     // table cell Tode
                var recovered = row.insertCell(3);  // table cell Gesund

                var countryText = country;
                // add text to cells
                countryName.appendChild(document.createTextNode(countryText));
                confirmed.appendChild(document.createTextNode(format(json.confirmed.value)));
                deaths.appendChild(document.createTextNode(format(json.deaths.value)));
                recovered.appendChild(document.createTextNode(format(json.recovered.value)));

                // add attributes for table sorting
                confirmed.setAttribute('data-sort-value', json.confirmed.value);
                deaths.setAttribute('data-sort-value', json.deaths.value);
                recovered.setAttribute('data-sort-value', json.recovered.value);
                $('#welt').tablesort().data('tablesort').sort($("th.default-sort"), 'desc');
            });
        });

        // make table sortable
        $('#welt').tablesort();
    });


    // dark theme toggle
    $("#theme-toggle").click(function() {
        //console.log(document.documentElement.getAttribute('data-theme'));
        if(document.documentElement.getAttribute('data-theme') == 'light') {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem("theme", "dark");
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem("theme", "light");
        }
    });

});

// format numbers with '.' as thousand separator
function format(text) {
    return text.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

function formSubmit() {
    var formData = new FormData(document.forms.contactform);
    var text = "Deine Eingaben"
        + "\nAnrede: " + formData.get('anrede')
        + "\nName: " + formData.get('vorname')
        + "\nNachname: " + formData.get('nachname')
        + "\nE-Mail: " + formData.get('email')
        + "\nNachricht: " + formData.get('nachricht');
    alert(text);
}

function scrollToTop() {
    window.scrollTo({top: 0, behavior: 'smooth'});
}

function setScrollUpVisible(visible) {
    if(visible) {
        document.getElementById('scrollUp').style.visibility = "visible";
        document.getElementById('scrollUp').style.opacity = 1;
    } else {
        document.getElementById('scrollUp').style.visibility = "hidden";
        document.getElementById('scrollUp').style.opacity = 0;
    }
}