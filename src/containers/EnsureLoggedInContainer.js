/**
Copy and paste this into your application
*/
import { authActions, authSelectors, EnsureLoggedIn } from 'web-components';
import { connect } from 'react-redux';

const mapStateToProps = state => ({
  me: authSelectors.getCurrentUser(state),
});

const mapDispatchToProps = dispatch => ({
  fetchMe: () => dispatch(authActions.fetchMe()),
});

export default connect(mapStateToProps, mapDispatchToProps)(EnsureLoggedIn);
