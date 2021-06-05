#!/bin/bash
exitErr(){ echo -e "$1" >&2 ; exit 1; }
usage="usage: $(basename $0) <image>"
helpStr=""

while getopts ":h" opt
do
	case $opt in
		h) exitErr "$usage\n$helpStr" ;;
		*) exitErr "$usage" ;;
	esac
done

shift $(($OPTIND - 1))

outDir=./icons/
image=$1

[ -z "$image" ] && exitErr "$usage"
[ -d  $outDir ]	|| exitErr "Missing -- $outDir"
[ -f "$image" ]	|| exitErr "Not a file -- $1"


if $(grep -q "\.png$" <(printf $image)); then
	function convertDim(){
		convert $image -resize $1x$1 $outDir/${image%%.png}$1.png
	}
	convertDim 16
	convertDim 48
	convertDim 128
else
	exitErr "Not a PNG file -- $1"
fi


