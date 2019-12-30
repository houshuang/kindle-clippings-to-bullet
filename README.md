# kindle-clippings-to-bullet

Script to convert "My Clippings.txt" file from Kindle to Markdown that is suitable for Roam

## Installation Instructions

1. Ensure that you are running Node v.13.5.0 or greater. You can check from the command line by typing in `node -v`.
1. Clone or download the repository.
1. From the command line, enter the directory.
1. Run `node index.mjs "<path to clippings file>" "<part of book title>"`

This assumes that only a single book matches your query, and will generate a Markdown output with that book title, the dates you read the book (assuming you read it linearly), and one line each for highlights and annotations (annotations are highlighted in yellow).
