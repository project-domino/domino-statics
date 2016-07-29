const _ =    require("lodash");
const gulp = require("gulp");
const zip =  require("gulp-zip");

const helpers = _([
	"copy",
	"js",
	"sass",
	"util",
]).map(name => [
	name,
	require(`./build_helpers/${name}.js`),
]).fromPairs().value();

gulp.task("ckeditor-copy", () => {
	gulp.src("../ckeditor/**")
		.pipe(gulp.dest("dist/ckeditor/"));
});
const targets = _(require("./targets.json")).map((targets, type) => {
	const helper = helpers[type];
	gulp.task(type, _.map(targets, (file, name) => {
		const targetName = `${type}:${name}`;
		gulp.task(targetName, () => {
			return helper(file, name)
				.pipe(gulp.dest("dist"));
		});
		return targetName;
	}));
	return type;
}).flatten().value().concat("ckeditor-copy");

gulp.task("default", targets, () => {
	gulp.src(["dist/**", "!dist/assets.zip", "!dist/doc"])
		.pipe(zip("assets.zip"))
		.pipe(gulp.dest("dist/"));
});
