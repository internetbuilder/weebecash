import React, { Component } from "react";

import { History } from "history";

import { Modal, Table, Button, Spinner } from "react-bootstrap";

import { Entry } from "../../store/entries/types";

import UserAvatar from "../user-avatar/index";
import FormattedCurrency from "../formatted-currency";
import AccountLink from "../account-link/index";

import { getPost } from "../../api/hive";

import parseAsset from "../../helper/parse-asset";

import { _t } from "../../i18n";

import { chevronLeftSvg, chevronRightSvg } from "../../../svg";

interface Vote {
  voter: string;
  rshares: string;
  reward?: number;
}

export const prepareVotes = (entry: Entry, votes: Vote[]): Vote[] => {
  const totalPayout =
    parseAsset(entry.pending_payout_value).value +
    parseAsset(entry.author_payout_value).value +
    parseAsset(entry.curator_payout_value).value;

  const voteRshares = votes.reduce((a, b) => a + parseFloat(b.rshares), 0);
  const ratio = totalPayout / voteRshares;

  return votes
    .map((a) => {
      const rew = parseFloat(a.rshares) * ratio;

      return Object.assign({}, a, {
        reward: rew,
      });
    })
    .sort((a, b) => {
      const keyA = a.reward;
      const keyB = b.reward;

      if (keyA > keyB) return -1;
      if (keyA < keyB) return 1;
      return 0;
    });
};

interface DetailProps {
  history: History;
  entry: Entry;
  onHide: () => void;
}

interface DetailState {
  loading: boolean;
  votes: Vote[];
  page: number;
}

export class EntryVotersDetail extends Component<DetailProps, DetailState> {
  state: DetailState = {
    loading: false,
    votes: [],
    page: 0,
  };

  componentDidMount() {
    const { entry } = this.props;

    this.setState({ loading: true });
    getPost(entry.author, entry.permlink)
      .then((r) => {
        this.setState({ votes: prepareVotes(entry, r.active_votes) });
      })
      .finally(() => {
        this.setState({ loading: false });
      });
  }

  prev = () => {
    const { page } = this.state;
    this.setState({ page: page - 1 });
  };

  next = () => {
    const { page } = this.state;
    this.setState({ page: page + 1 });
  };

  render() {
    const { onHide } = this.props;
    const { loading, votes, page } = this.state;

    return (
      <>
        <Modal onHide={onHide} show={true} centered={true}>
          <Modal.Header closeButton={true}>
            <Modal.Title>
              {(() => {
                if (loading) {
                  return _t("entry-voters.detail-title");
                }
                return _t("entry-voters.detail-title-n", { n: votes.length });
              })()}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="voters-dialog-content">
              {(() => {
                if (loading) {
                  return <Spinner animation="grow" variant="primary" />;
                }

                const { page } = this.state;

                const pageSize = 6;
                const totalPages = Math.ceil(votes.length / pageSize);

                const start = page * pageSize;

                const hasPrev = page !== 0;
                const hasNext = page + 1 !== totalPages;

                const list = votes.slice(start, start + pageSize);

                return (
                  <>
                    <Table borderless={true} striped={true}>
                      <tbody>
                        {list.map((v, i) => (
                          <tr key={i}>
                            <td className="voter-cell">
                              <AccountLink {...this.props} username={v.voter}>
                                <span className="account">
                                  <UserAvatar username={v.voter} size="small" />{" "}
                                  {v.voter}
                                </span>
                              </AccountLink>
                            </td>
                            <td className="reward-cell">
                              <FormattedCurrency
                                {...this.props}
                                value={v.reward}
                                fixAt={3}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                    <div className="voters-pagination">
                      <Button size="sm" disabled={!hasPrev} onClick={this.prev}>
                        {chevronLeftSvg}
                      </Button>
                      <div className="page-numbers">
                        <span className="current-page"> {page + 1}</span> /{" "}
                        {totalPages}
                      </div>
                      <Button size="sm" disabled={!hasNext} onClick={this.next}>
                        {chevronRightSvg}
                      </Button>
                    </div>
                  </>
                );
              })()}
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

interface Props {
  entry: Entry;
  children: JSX.Element;
}

interface State {
  visible: boolean;
}

export default class EntryVoters extends Component<Props, State> {
  state: State = {
    visible: false,
  };

  toggle = () => {
    const { visible } = this.state;
    this.setState({ visible: !visible });
  };

  render() {
    const { children, entry } = this.props;
    const { visible } = this.state;

    const clonedChildren = React.cloneElement(children, {
      onClick: this.toggle,
    });

    return (
      <>
        {clonedChildren}
        {visible && (
          <EntryVotersDetail
            {...this.props}
            entry={entry}
            onHide={this.toggle}
          />
        )}
      </>
    );
  }
}
