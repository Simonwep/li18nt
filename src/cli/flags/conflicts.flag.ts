import {conflicts} from '@tools/conflicts';
import {CLIModule} from '@types';
import {getLoggingSet, successLn} from '@utils/log';
import {makeList} from '@utils/makeList';
import {pluralize} from '@utils/pluralize';
import {prettyPropertyPath} from '@utils/prettyPropertyPath';

/* eslint-disable no-console */
export const conflictsFlag: CLIModule = ({files, cmd, rule}) => {
    const diff = conflicts(files.map(v => v.content));
    const [mode] = rule;
    const {log, accent} = getLoggingSet(mode);
    let count = 0;

    for (let i = 0; i < diff.length; i++) {
        const {conflicts, missing} = diff[i];
        const {name} = files[i];

        if (conflicts.length) {
            log(`${accent(`${name}:`)} Found ${pluralize('conflict', conflicts.length)}:`);

            if (conflicts.length > 1) {
                console.log();

                for (const [num, path] of makeList(conflicts)) {
                    console.log(`    ${num}. ${prettyPropertyPath(path, accent)}`);
                }
            } else {
                console.log(` ${prettyPropertyPath(conflicts[0], accent)}`);
            }
        }

        if (missing.length) {
            log(`${accent(`${name}:`)} Found ${pluralize('one missing value', missing.length)}:`);

            if (missing.length > 1) {
                console.log();

                for (const [num, path] of makeList(missing)) {
                    console.log(`    ${num}. ${prettyPropertyPath(path, accent)}`);
                }
            } else {
                console.log(` ${prettyPropertyPath(missing[0], accent)}`);
            }
        }

        count += conflicts.length + missing.length;
    }

    !count && !cmd.quiet && successLn('No conflicts found!');
    return mode === 'warn' || !count;
};
