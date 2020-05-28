import {Entry} from '../store/entries/types';

import parseToken from './parse-token';
import isEmptyDate from './is-empty-date';

export default (entry: Entry) => {
    if (entry.pending_payout_value && isEmptyDate(entry.last_payout)) {
        return entry.total_payout_value ? parseToken(entry.total_payout_value) + parseToken(entry.pending_payout_value) : 0;
    }

    return entry.total_payout_value ? parseToken(entry.total_payout_value) + parseToken(entry.curator_payout_value) : 0;
};