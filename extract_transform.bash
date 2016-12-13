#!/bin/bash

# Extraction
## Extract relevant data
## $in $type $out
function extract {

  echo "function = extract"
  echo arg1 = $1
  echo arg2 = $2
  echo arg3 = $3

  cat $1 | grep $2 > $3

}

# Transformation
## Transforms into JSON
## transform $in $type $out
function transform {

  echo "function = transform"
  ./transform.js $1 > $2
}

# Load
## Load the data to Couchbase
## load $in $bucket
function load {

  echo "function = load"
  while read line
  do
    key=`echo $line | cut -f1-3 -d':'`
    key=`echo $key | sed s/\"/\'/g`
    value=`echo $line | cut -f4-1000 -d':'`
    value=`echo \'$value\' | sed 's/ {/{/g'`

    echo "cbc-create $key -V $value -U couchbase://localhost/$2" > $TMP/cmd.exec
    /bin/bash $TMP/cmd.exec
  done < $1

}


# Input
export INPUT=movies.neo4j

# Make tmp dir
export TMP=./tmp
mkdir $TMP

# Extract all Persons
export PERSONS_RAW=$TMP/persons_raw.out
export PERSONS_JSON=$TMP/persons.json
extract $INPUT Person $PERSONS_RAW
transform $PERSONS_RAW $PERSONS_JSON
load $PERSONS_JSON movies

# Extract all movies
export MOVIES_RAW=$TMP/movies_raw.out
export MOVIES_JSON=$TMP/movies.json
extract $INPUT Movie $MOVIES_RAW
transform $MOVIES_RAW $MOVIES_JSON
load $MOVIES_JSON movies
