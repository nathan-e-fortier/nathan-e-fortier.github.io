/*
 * @title Assets
 * @description A task to copy assets.
 */

// Dependencies
import { src, dest } from 'gulp';
import plumber from 'gulp-plumber';
import changed from 'gulp-changed';
import errorHandler from '../util/errorHandler.js';

// Config
import { paths } from '../config';

// Task
export function assets() {
  return src(paths.assets.src)
    .pipe(plumber({ errorHandler }))
    .pipe(changed(paths.assets.dest))
    .pipe(dest(paths.assets.dest));
}

export function sitemap() {
  return src('src/sitemap.xml')
    .pipe(plumber({ errorHandler }))
    .pipe(dest(paths.dest));
}
