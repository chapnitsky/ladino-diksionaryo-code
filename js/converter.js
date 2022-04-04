$(document).ready(function(){
    var english_to_ladino = null;
    var ladino_to_english = null;
    var dictionary = null;
    var course_data = null;
    var loaded = 0;
    var direction = 'ladino-to-english';
    var source_language = 'ladino';

    // const update_direction_selector = function() {
    //     $('#ladino-to-english').removeClass('is-warning');
    //     $('#english-to-ladino').removeClass('is-warning');
    //     $('#' + direction).addClass('is-warning');
    // };

    var try_translate = function() {
        if (loaded == 4) {
            // update_direction_selector();
            translate();
        }
    };
    var translate = function() {
        const original = $("#input-text").val();
        //const cleaned = original.replace(/["';,!?.:]/g, " ");
        //const cleaned = original.replace(/[^a-zA-Z-]/g, " ");
        const cleaned = original.replace(/[<>,.:!?"'\n*()=\[\]]/g, " ");
        const words = cleaned.split(" ");
        let languages = Object.keys(dictionary).filter(function(name) { return name != 'ladino'}) ;
        languages.sort();
        // console.log(languages);
        var html = `<table class="table">`;
        html += '<thead>';
        //html += `<tr><th colspan="2" style="text-align:center">old dictionary</th><th style="width: 100px"></th><th colspan="${languages.length+1}" style="text-align:center">new dictionary</th></tr>`;
        html += '<tr>';
        // if (direction == 'ladino-to-english') {
        //     html += `<th>${course_data['target_language_name']}</th><th>${course_data['source_language_name']}</th>`;
        // } else {
        //     html += `<th>${course_data['source_language_name']}</th><th>${course_data['target_language_name']}</th>`;
        // }

        // html += `<th></th>`;
        html += `<th>?</th><th>ladino</th>`;
        for (var ix=0; ix < languages.length; ix++) {
            html += `<th>${languages[ix]}</th>`;
        }
        html += '</tr>';
        html += '</thead>';
        html += '<tbody>';
        for (var ix = 0; ix < words.length; ix++) {
            if (words[ix] == "") {
                continue;
            }
            var word = words[ix].toLowerCase()
            const english = ladino_to_english[word];

            html += '<tr>';
            // if (direction == 'ladino-to-english') {
            //     const translation = ladino_to_english[word];
            //     if (translation) {
            //         html += `<td><a href="target/${word}.html">${words[ix]}</a></td><td>${translation}</td>`;
            //     } else {
            //         html += `<td class="has-background-danger-light">${words[ix]}</td><td class="has-background-danger-light"></td>`;
            //     }
            // } else {
            //     const translation = english_to_ladino[word];
            //     if (translation) {
            //         html += `<td><a href="source/${word}.html">${words[ix]}</a></td><td>${translation}</td>`;
            //     } else {
            //         html += `<td class="has-background-danger-light">${words[ix]}</td><td class="has-background-danger-light"></td>`;
            //     }
            // }

            //html += "<td></td>";
            const dict_word = dictionary['ladino'][word];

            if (dict_word || english) {
                html += `<td class="has-background-success-light">${word}</td>`;
            } else {
                html += `<td class="has-background-danger-light">${word}</td>`;
            }
            if (dict_word) {
                // console.log(dict_word);
                html += `<td>${word}</td>`;
            } else if (english) {
                html += `<td><a href="target/${word}.html">${word}</a></td>`;
            } else {
                html += "<td></td>";
                //html += `<td class="has-background-danger-light">${word}</td>`;
            }
            for (var jx=0; jx < languages.length; jx++) {
                html += `<td>`;
                if (dict_word) {
                    html += dict_word['translations'][languages[jx]] || '';
                } else if (languages[jx] == 'english') {
                    html += english || '';
                }
                html += `</td>`;
            }


            html += '</tr>';
        }
        html += '</tbody>';
        html += "</table>";

        $("#output").html(html);
    };
    $.getJSON("course.json", function(data){
        course_data = data;
        loaded++;
        try_translate();
    }).fail(function(){
        console.log("An error has occurred.");
    });

    $.getJSON("dictionary.json", function(data){
        dictionary = data;
        loaded++;
        try_translate();
    }).fail(function(){
        console.log("An error has occurred while loading dictionary.json");
    });


    $.getJSON("source-to-target.json", function(data){
        english_to_ladino = data;
        loaded++;
        try_translate();
    }).fail(function(){
        console.log("An error has occurred.");
    });

    $.getJSON("target-to-source.json", function(data){
        ladino_to_english = data;
        loaded++;
        try_translate();
    }).fail(function(){
        console.log("An error has occurred.");
    });

    $('#input-text').bind('input propertychange', translate);
    //$("#ladino-to-english").click(function() {
    //    direction = 'ladino-to-english';
    //    update_direction_selector();
    //    translate();
    //});
    //$("#english-to-ladino").click(function() {
    //    direction = 'english-to-ladino';
    //    update_direction_selector();
    //    translate();
    //});
    //update_direction_selector();
});

