# a complete or incomplete castle comprised of several castle blocks
class Castles
	_fieldScore: 0
	_score: 0
	completed: false
	taken: {}

	castle: []
	blocks: []
	takens: [0,0,0,0,0,0]

	merge: (Castles...) ->

	isComplete: ->

	takenBy: ->
		max = 0
		hosts = []

		for num in [1..6]
			if @taken[num] > max
				max = @taken[num]
				hosts.clear
				hosts.push num
			if @taken[num] == max
				hosts.push num
		hosts

class Castle
	value: 0
	taken: 0
