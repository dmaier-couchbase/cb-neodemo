# Extract all Persons
cat movies.neo4j | grep Person | cut -f2 -d'(' | cut -f1 -d')' | sed 's/Person/Person" :/g' | awk '{print "\""$0}'
