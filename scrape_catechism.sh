#!/bin/bash

# Check if both URL and filename parameters are provided
if [ "$#" -ne 2 ]; then
    echo "Usage: $0 <URL> <output-filename>"
    exit 1
fi

# Parameters
URL="$1"
OUTPUT_FILE="$2"

# Fetch the webpage, filter content, and format it as a JavaScript object
curl -s "$URL" | \
awk '
BEGIN {
    print "export const childrenCatechism = [";
    question = "";
    answer = "";
    inside_question = 0;
    inside_answer = 0;
}
/<p class="question">/ {
    question = $0;
    sub(/.*<p class="question">Q\. [0-9]+\. /, "", question);
    sub(/<\/p>.*/, "", question);
    inside_question = 1;
}
/<p class="answer">/ {
    answer = $0;
    sub(/.*<p class="answer">A\. /, "", answer);
    sub(/<\/p>.*/, "", answer);
    inside_answer = 1;
}
/<b>Q\. [0-9]+\.<\/b>/ {
    question = $0;
    sub(/.*<b>Q\. [0-9]+\.<\/b> */, "", question);
    inside_question = 1;
}
/<b>A\.<\/b>/ {
    answer = $0;
    sub(/.*<b>A\.<\/b> */, "", answer);
    inside_answer = 1;
}
/<\/p>/ && inside_question {
    gsub(/<[^>]*>/, "", question); # Remove any remaining HTML tags
    inside_question = 0;
}
/<\/p>/ && inside_answer {
    gsub(/<[^>]*>/, "", answer); # Remove any remaining HTML tags
    inside_answer = 0;
    if (question != "" && answer != "") {
        printf "    { question: \"%s\", answer: \"%s\" },\n", question, answer;
        question = "";
        answer = "";
    }
}
END {
    print "];";
}' > "$OUTPUT_FILE"

# Notify the user
echo "Scraped data has been saved to $OUTPUT_FILE"