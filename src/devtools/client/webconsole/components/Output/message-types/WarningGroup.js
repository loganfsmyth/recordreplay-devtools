/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

"use strict";

// React & Redux
const { createFactory } = require("react");
const dom = require("react-dom-factories");

const PropTypes = require("prop-types");
const Message = createFactory(require("devtools/client/webconsole/components/Output/Message"));

const { PluralForm } = require("devtools/shared/plural-form");
const { l10n } = require("devtools/client/webconsole/utils/messages");
const messageCountTooltip = "#1 message;#1 messages";

WarningGroup.displayName = "WarningGroup";

WarningGroup.propTypes = {
  dispatch: PropTypes.func.isRequired,
  message: PropTypes.object.isRequired,
  timestampsVisible: PropTypes.bool.isRequired,
  badge: PropTypes.number.isRequired,
};

function WarningGroup(props) {
  const { dispatch, message, timestampsVisible, badge, open } = props;

  const { source, type, level, id: messageId, indent, timeStamp } = message;

  const messageBody = [
    message.messageText,
    " ",
    dom.span(
      {
        className: "warning-group-badge",
        title: PluralForm.get(badge, messageCountTooltip).replace("#1", badge),
      },
      badge
    ),
  ];
  const topLevelClasses = ["cm-s-mozilla"];

  return Message({
    badge,
    collapsible: true,
    dispatch,
    indent,
    level,
    messageBody,
    messageId,
    open,
    source,
    timeStamp,
    timestampsVisible,
    topLevelClasses,
    type,
    message,
  });
}

module.exports = WarningGroup;
