function predictTitles() {
    var skill_list = ["python", "r", "sql", "c", "c++", "java", "javascript", "bash", "matlab"];

    var box, option, skills;
    var input = 0;
    box = document.getElementById("multiselect2_to");
    option = box.getElementsByTagName("option")
    if (option.length == 0){
        var html= "<br><br><br><p> <b> Top Career Choices : <b><p><ul>Please select your skills. <br>E.g. Python, R, SQL, C, C++, Java, JavaScript, Bash, MATLAB</ul><br>";
        document.getElementById("show_id").innerHTML = html;
        return
    }
    for (var i=0; i<option.length; i++) {
        skills = skills + (option[i].value)+"-";
    }

    for (var i=0; i<skill_list.length; i++) {
        if (skills.includes(skill_list[i]+"-")){
            input = 1 + input*10
        } else {
            input = input *10
        }
    }
    if (input == 0){
        var html= "<br><br><br><p> <b> Top Career Choices : <b><p><ul>Did you miss to add some basic skills?  <br>E.g. Python, R, SQL, C, C++, Java, JavaScript, Bash, MATLAB</ul><br>";
        document.getElementById("show_id").innerHTML = html;
        return
    }
    var csv_path = "data/clean_data.csv";
    var jobs  = ['Machine Learning Engineer / Research Scientist', 'DBA/Database Engineer / Data Engineer / Software Engineer','Program/Project Manager / Product Manager / Statistician / Developer Relations/Advocacy','Data Analyst', 'Data Scientist', 'Business Analyst']
    var scores = [0,0,0,0,0,0];
    $.when($.get(csv_path)).then(
        function (data) {
            var csvData = $.csv.toArrays(data,  {separator: ",",delimiter: '"'});
            //skip header
            for (var rowIdx = 1; rowIdx < csvData.length; rowIdx++) {
                var y = parseInt(csvData[rowIdx][0], 10);
                var x = 0;
                for (var colIdx = 1; colIdx < csvData[rowIdx].length; colIdx++) {
                    x = x*10
                    if (csvData[rowIdx][colIdx] == "1"){
                        x = x +1
                    }
                }
                scores[y] = scores[y] + calc_score(input,x)
            }
            var indices = new Array(scores);
            for (var i = 0; i < 6; ++i){
                indices[i] = i;
            }
            indices.sort(function (a, b) { return scores[a] < scores[b] ? -1 : scores[a] > scores[b] ? 1 : 0; });
            var html= "<br><br><br><p> <b> Top Career Choices : <b><p><ul>";
            for (var i = 5; i >2; --i){
                var ind_value = indices[i]
                html += "<li>" + jobs[ind_value] + "</li>";
            }
            html += "</ul><br>"
            document.getElementById("show_id").innerHTML = html;
            return
       });
}

function calc_score(a, b){
    var diff = 0;
    var a2 = a;
    var b2 = b;
    var base = 10;
    for (var i=0; i<9; i++) {
        if (a2 % base != b2% base){
            //only same or 1 diff is acceptable
            if (diff > 0){
                return 0;
            } else {
              diff = diff +1;
            }
        }

        a2 = Math.floor(a2/base);
        b2 = Math.floor(b2/base);
    }
    return 1/(Math.sqrt(diff) + 0.01);
}

