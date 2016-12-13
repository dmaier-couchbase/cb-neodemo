#!/usr/bin/env node
var fs = require('fs');

function usage() {

 console.log("Use: ./transform.js $name_raw.out")
 console.log("");
 console.log("The input files has entries of the following format:")
 console.log("CREATE (TheMatrix:Movie {title:'The Matrix', released:1999, tagline:'Welcome to the Real World'})")

}

function _trim (str) {
    return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}

function main() {

   var args = process.argv;

   if (args.length == 3) {

     console.log("Starting Transformation ...");

     var file = args[2];

     console.log("file = " + file);

     fs.readFileSync(file).toString().split('\n').forEach(function (line) {

       //console.log("Processing line: " + line);
       if (line.startsWith("CREATE")) {

         //Remove the outer brackets
         var entry = line.split("(")[1].split(")")[0];
         var key = _trim(entry.split("{")[0]);
         var values = _trim(entry.split("{")[1].split("}")[0]);
         var comma_split_values = values.split(",");

         var prop;
         var val = "";
         var pairs = [];

         for (var i = 0; i < comma_split_values.length; i++) {

           var v = comma_split_values[i];

           var isPropLine = new RegExp('^.*\:.*');

           if (isPropLine.test(v)) {

             prop = _trim(v.split(":")[0]);
             v = _trim(v.split(":")[1]);

             //console.log(prop);

           }

           var isDqDet = new RegExp('^\".*\"$');
           var isSqDet = new RegExp('^\'.*\'$');
           var isNumber = new RegExp('^[0-9]*$');

           if (isDqDet.test(v) || isSqDet.test(v) || isNumber.test(v)) {

             val = v;

             pairs.push({ "prop" : prop, "value" : val });

           } else {

             var startsWithSq = new RegExp('^\'.*$');
             var startsWithDq = new RegExp('^\".*$');

             if (startsWithSq.test(v) || startsWithDq.test(v)) {

                val = "";
             }

             if (val !== "") {
               val = val + ", " + v;
             }

             var endsWithDq = new RegExp('^.*\"$');
             var endsWithSq = new RegExp('^.*\'$');

             if (endsWithSq.test(val) || endsWithDq.test(val)) {

               pairs.push({ "prop" : prop, "value" : val});

             }
           }
         }

          //console.log(pairs);
          //Generate the output
          var new_line = "";
          new_key = key.split(":")[1] + "::" + key.split(":")[0];
          new_key = "\"" + new_key + "\"";

          new_line = new_key + " : " + "{"

          for (var i = 0; i < pairs.length; i++) {

            p = pairs[i];

            if (i > 0) {
               new_line = new_line + ", ";
            }

            new_line = new_line + "\"" + p.prop + "\" : ";

            var v = p.value;

            if (v.indexOf("'") == 0) v =  "\"" + v.substring(1, v.lenght);
            if (v.lastIndexOf("'") == v.length-1) v = v.substring(0, v.length-1) + "\"";

            new_line = new_line + v;
          }

          new_line = new_line + "}";

          console.log(new_line);
       }
     });

   }
   else {

     usage();
   }

}

main();
