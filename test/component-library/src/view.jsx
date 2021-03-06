import routers from './utils/routers';
import events from './utils/events';
import Utils from './utils/utils';
import Mixins from './utils/mixins';

const ViewProps = Utils.extend(
  {
    tab: Boolean,
    tabActive: Boolean,

    name: String,
    router: Boolean,
    linksView: [Object, String],
    url: String,
    main: Boolean,
    stackPages: Boolean,
    xhrCache: String,
    xhrCacheIgnore: Array,
    xhrCacheIgnoreGetParameters: Boolean,
    xhrCacheDuration: Number,
    preloadPreviousPage: Boolean,
    uniqueHistory: Boolean,
    uniqueHistoryIgnoreGetParameters: Boolean,
    allowDuplicateUrls: Boolean,
    reloadPages: Boolean,
    removeElements: Boolean,
    removeElementsWithTimeout: Boolean,
    removeElementsTimeout: Number,
    restoreScrollTopOnBack: Boolean,
    // Swipe Back
    iosSwipeBack: Boolean,
    iosSwipeBackAnimateShadow: Boolean,
    iosSwipeBackAnimateOpacity: Boolean,
    iosSwipeBackActiveArea: Number,
    iosSwipeBackThreshold: Number,
    // Push State
    pushState: Boolean,
    pushStateRoot: String,
    pushStateAnimate: Boolean,
    pushStateAnimateOnLoad: Boolean,
    pushStateSeparator: String,
    pushStateOnLoad: Boolean,
    // Animate Pages
    animate: Boolean,
    // iOS Dynamic Navbar
    iosDynamicNavbar: Boolean,
    iosSeparateDynamicNavbar: Boolean,
    // Animate iOS Navbar Back Icon
    iosAnimateNavbarBackIcon: Boolean,
    // MD Theme delay
    materialPageLoadDelay: Number,

    passRouteQueryToRequest: Boolean,
    passRouteParamsToRequest: Boolean,
    routes: Array,
    routesAdd: Array,

    init: {
      type: Boolean,
      default: true,
    },
  },
  Mixins.colorProps,
);

export default {
  name: 'f7-view',
  props: ViewProps,
  state() {
    return {
      pages: [],
    };
  },
  render() {
    const self = this;
    return (
      <div ref="el" id={self.props.id} style={self.props.style} className={self.classes}>
        <slot />
        {self.state.pages.map((page) => {
          const PageComponent = page.component;
          return (
            <PageComponent key={page.id} {...page.props} />
          );
        })}
      </div>
    );
  },
  componentDidMount() {
    const self = this;
    const el = self.refs.el;

    self.onSwipeBackMove = self.onSwipeBackMove.bind(self);
    self.onSwipeBackBeforeChange = self.onSwipeBackBeforeChange.bind(self);
    self.onSwipeBackAfterChange = self.onSwipeBackAfterChange.bind(self);
    self.onSwipeBackBeforeReset = self.onSwipeBackBeforeReset.bind(self);
    self.onSwipeBackAfterReset = self.onSwipeBackAfterReset.bind(self);
    self.onTabShow = self.onTabShow.bind(self);
    self.onTabHide = self.onTabHide.bind(self);

    el.addEventListener('swipeback:move', self.onSwipeBackMove);
    el.addEventListener('swipeback:beforechange', self.onSwipeBackBeforeChange);
    el.addEventListener('swipeback:afterchange', self.onSwipeBackAfterChange);
    el.addEventListener('swipeback:beforereset', self.onSwipeBackBeforeReset);
    el.addEventListener('swipeback:afterreset', self.onSwipeBackAfterReset);
    el.addEventListener('tab:show', self.onTabShow);
    el.addEventListener('tab:hide', self.onTabHide);

    self.setState({ pages: [] });

    self.$f7ready((f7) => {
      if (!self.props.init) return;
      self.routerData = {
        el,
        component: self,
        instance: null,
      };
      routers.views.push(self.routerData);
      // phenome-vue-next-line
      self.routerData.instance = f7.views.create(el, self.$options.propsData || {});
      // phenome-react-next-line
      self.routerData.instance = f7.views.create(el, self.props);
      self.f7View = self.routerData.instance;
    });
  },
  componentWillUnmount() {
    const self = this;
    const el = self.refs.el;

    el.removeEventListener('swipeback:move', self.onSwipeBackMove);
    el.removeEventListener('swipeback:beforechange', self.onSwipeBackBeforeChange);
    el.removeEventListener('swipeback:afterchange', self.onSwipeBackAfterChange);
    el.removeEventListener('swipeback:beforereset', self.onSwipeBackBeforeReset);
    el.removeEventListener('swipeback:afterreset', self.onSwipeBackAfterReset);
    el.removeEventListener('tab:show', self.onTabShow);
    el.removeEventListener('tab:hide', self.onTabHide);

    if (!self.props.init) return;
    if (self.f7View && self.f7View.destroy) self.f7View.destroy();
    routers.views.splice(routers.views.indexOf(self.routerData), 1);
    delete self.routerData;
  },
  componentDidUpdate() {
    const self = this;
    if (!self.routerData) return;
    events.emit('viewRouterDidUpdate', self.routerData);
  },
  computed: {
    classes() {
      return Utils.classNames(
        this.props.className,
        {
          view: true,
          'view-main': this.props.main,
          'tab-active': this.props.tabActive,
          tab: this.props.tab,
        },
        Mixins.colorClasses(this),
      );
    },
  },
  methods: {
    onSwipeBackMove(event) {
      this.dispatchEvent('swipeback:move swipeBackMove', event, event.detail);
    },
    onSwipeBackBeforeChange(event) {
      this.dispatchEvent('swipeback:beforechange swipeBackBeforeChange', event, event.detail);
    },
    onSwipeBackAfterChange(event) {
      this.dispatchEvent('swipeback:afterchange swipeBackAfterChange', event, event.detail);
    },
    onSwipeBackBeforeReset(event) {
      this.dispatchEvent('swipeback:beforereset swipeBackBeforeReset', event, event.detail);
    },
    onSwipeBackAfterReset(event) {
      this.dispatchEvent('swipeback:afterreset swipeBackAfterReset', event, event.detail);
    },
    onTabShow(e) {
      this.dispatchEvent('tab:show tabShow', e);
    },
    onTabHide(e) {
      this.dispatchEvent('tab:hide tabHide', e);
    },
  },
};
