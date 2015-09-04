class Roads
	_roads: []
	_score: 0

	takens: [0,0,0,0,0,0]
	takenBy: 0

	isComplete: ->
		if _.filter(@_roads, (r) -> r.isVertex).length is 2
			true
		else
			false

	probe: (block, pos) ->
		start = [block.gx, block.gy]
		_probe(block, pos)

	_probe: (block, pos)->
		neighbors = @getNeighbors(block.gx, block.gy)

		gx = neighbors[pos][0]
		gy = neighbors[pos][1]

		if [gx, gy] is start # a circle
			@renderFinishedRoad()
			return

		console.info 'next block' + gx + '; ' + gy

		nextBlock = @grid[gx][gy][3]
		return unless nextBlock?

		@_score += 1

		nextPos = nextBlock.edgesConnect[@getContra(pos)]
		placedBy = nextBlock.followerPlaced[@getContra(pos)]

		if nextPos is 4
			@renderFinishedRoad()
			return # endpoint
		takens[placedBy] += 1 if placedBy?
		@probe(nextBlock, nextPos)

	getContra: (pos) ->
		dic =
			0:2
			1:3
			2:0
			3:1
		dic.pos

	renderFinishedRoad: ->
		console.log 'get the fucking follower'

	# merge: (Road, _road) ->
	# 	@roads.push(_road)
	# 	for r in Road
	# 		@roads.push r


class Road
	id: 0
	isVertex: false
	position: 0
	# 1: left right
