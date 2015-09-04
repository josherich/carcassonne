class Fields
	graph: {}

	fields: []

	marked: []

	taken: []

	# calculate wrapping castles
	wrapCastles: (src) ->
		@dfs(@graph, src)

	dfs: (graph, src) ->
		@marked[src] = true

		if @fields[src].Castle.completed
			user.fieldScore += @fields[src].wrapCastleScore()
		# count++

		for v in graph.adj[src]
			@dfs(graph, v) unless @marked[v]

# a field in a block
class Field
	_castle1: {}
	_castle2: {}

	Castle1: {}
	Castle2: {}

	taken: 0

	wrapCastleScore: ->
		Castle1.fieldScore + Castle2.fieldScore


class FieldsGraph
	constructor: (size)->
		while size--
			@adj[size] = []

	adj: {}

	add: (a, b) ->
		@adj[a].push b
		@adj[b].push a


