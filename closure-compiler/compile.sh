# Compile .js file using the Google Closure Compiler

INPUT_JS="../static/js/site.js"
OUTPUT_JS="../static/js/site.min.js"

# check if .jar exists in this folder
if [ ! -f ./closure-compiler.jar ]; then
    echo "No closure-compiler.jar found!
Put it in the folder '/closure-compiler' and run this script from there."
    exit 1
fi

echo "Compiling js..."
# put own closure-compiler.jar in same folder; 
# Version used by me; 20230504
java -jar closure-compiler.jar --js $INPUT_JS --js_output_file $OUTPUT_JS
echo "DONE\n"