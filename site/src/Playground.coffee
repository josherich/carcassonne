class Playground
	constructor: (data, n)->
		@Users = new Users(n)
		@initBlock data

	Blocks: {}
	Users: {}

	initBlock: (data) ->
		@Blocks = new Blocks data, @next, @Users

		user = @Users.nextUser()
		@Blocks.currentUser = user
		@setUserUI(user)
		@Blocks._playground = this
		# requestAnimFrame animate

	next: =>
		if @Blocks.hasBlockLeft()
			user = @Users.nextUser()
			@Blocks.currentUser = user
			@setUserUI(user)

	setUserUI: (user) ->
		s = user.id + ' is playing'
		$('#user').html(s)

	placeBlock: (block) ->
		# drag to valid position

	placeFollower: (block) ->
		# choose valid position to stand

	render: (block) ->
		@renderRoad(block)
		@renderCastle(block)
		@renderField(block)
		@renderCloister(block)

	renderRoad: (block) ->
		for e in block._roadEdges
			completed = false
			start = e
			score = 1
			takens = @takenInit()
			while e.pair.next?
				score += 1

				if block.isCrossRoad and e.pair.next is 'cross'
					completed = true
					break

				takens[e.pair.takenBy] += 1
				e = e.pair.next

			if completed
				@completeRoad( score, @takenBy(takens), 'road' )
				continue

			for user in @takenBy(takens)
				user.roadScore += score

	renderCastle: (block) ->
		Castles.castleDFS( CastleGraph, block ) if block._castles?

	renderField: (block) ->
		Fields.wrapCastles(block)

	renderCloister: (block) ->
		neighbors = Block.getNeighbors(block)
		user = block.takenBy
		user.scored['Cloister'] += neighbors.length

	takenInit: ->
		i = @Users.num
		taken = {}
		while i--
			taken[i] = 0
			taken

	takenBy: (takens) ->
		for user, num in takens
			if num > max
				max = num
		_.filter [num for user, num of takens], (x)->x is max

	complete: ( score, takens, type ) ->
		for user in takens
			user.scored[type] += score
		UI.removeFollowers(takens)
