docker run --rm -v %cd%/site:/srv/site -v %cd%/stylus:/srv/stylus --mount source=devpaul-code,target=/srv/_dist devpaul-build-site
