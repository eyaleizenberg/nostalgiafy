import * as React from "react";
import Button from "react-bootstrap/Button";

export class PaypalButton extends React.PureComponent {
  readonly formRef = React.createRef<HTMLFormElement>();

  handleClick = () => {
    if (this.formRef.current) {
      this.formRef.current.submit();
    }
  };

  render() {
    return (
      <form
        action="https://www.paypal.com/cgi-bin/webscr"
        method="post"
        target="_top"
        ref={this.formRef}
      >
        <input type="hidden" name="cmd" value="_s-xclick" />
        <input type="hidden" name="hosted_button_id" value="CBG7WVGM5HUA4" />
        <input
          type="image"
          src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_SM.gif"
          name="submit"
          title="PayPal - The safer, easier way to pay online!"
          alt="Donate with PayPal button"
          className="paypal-image"
        />
        <img
          alt=""
          src="https://www.paypal.com/en_IL/i/scr/pixel.gif"
          width="1"
          height="1"
        />

        <Button variant="warning" onClick={this.handleClick}>
          Donate
        </Button>
        <style jsx>{`
          .paypal-image {
            display: none;
          }
        `}</style>
      </form>
    );
  }
}
